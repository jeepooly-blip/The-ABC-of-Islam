import { NextRequest, NextResponse } from 'next/server';

function getText(val: any, locale?: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return (locale && val[locale]) || val.en || Object.values(val)[0] || '';
  return String(val);
}

export async function POST(request: NextRequest) {
  try {
    const { locale, ageLevel } = await request.json();

    const contentModule = await import('@/lib/content');
    const content = contentModule.getContent(locale);

    const EPub = (await import('epub-gen')).default;

    const chapters = content.map((item) => {
      const title = getText(item.title, locale);
      const contentText = getText((item.content as any)[ageLevel], locale);
      const funFactText = getText(item.funFact, locale);

      return {
        title: `${title}`,
        data: `
          <div style="text-align: center; font-size: 48px; margin: 20px 0;">${item.emoji}</div>
          <h1 style="text-align: center; color: #FF6B35;">${title}</h1>
          <p style="font-size: 14px; text-align: center; color: #999;">${ageLevel}</p>
          <hr />
          <p style="font-size: 16px; line-height: 1.8;">${contentText}</p>
          <hr />
          <div style="background: #FFF9E3; padding: 15px; border-left: 4px solid #FFC300; margin-top: 20px;">
            <strong style="color: #FFC300;">Fun Fact!</strong><br />
            ${funFactText}
          </div>
        `,
      };
    });

    const options = {
      title: 'The ABC of Islam',
      author: 'The ABC of Islam Team',
      publisher: 'ABC of Islam',
      lang: locale,
      appendChapterTitles: true,
      chapters,
    };

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const epub = new EPub(options);
      epub.on('end', () => {
        // @ts-ignore
        const zip = epub.zip;
        if (zip) {
          zip.generateAsync({ type: 'nodebuffer' }).then(resolve).catch(reject);
        } else {
          reject(new Error('EPUB zip not available'));
        }
      });
      epub.on('error', reject);
      epub.write('');
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="abc-of-islam-${locale}.epub"`,
      },
    });
  } catch (error) {
    console.error('EPUB generation error:', error);
    return NextResponse.json({ error: 'Failed to generate EPUB' }, { status: 500 });
  }
}
