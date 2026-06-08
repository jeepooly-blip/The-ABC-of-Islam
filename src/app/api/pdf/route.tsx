import { NextRequest, NextResponse } from 'next/server';

function getText(val: any, locale?: string): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return (locale && val[locale]) || val.en || Object.values(val)[0] || '';
  return String(val);
}

export async function POST(request: NextRequest) {
  try {
    const { locale, ageLevel, topicId } = await request.json();

    const contentModule = await import('@/lib/content');
    const content = contentModule.getContent(locale);
    const filteredContent = topicId ? content.filter(c => c.id === topicId) : content;

    const { Document, Page, Text, View, StyleSheet, pdf } = await import('@react-pdf/renderer');

    const styles = StyleSheet.create({
      page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
      },
      cover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#FF6B35',
      },
      subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666666',
        marginBottom: 40,
      },
      letterTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#FF6B35',
      },
      icon: {
        fontSize: 48,
        textAlign: 'center',
        marginBottom: 10,
      },
      content: {
        fontSize: 14,
        lineHeight: 1.8,
        marginBottom: 20,
      },
      funFact: {
        fontSize: 12,
        padding: 15,
        backgroundColor: '#FFF9E3',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC300',
        marginBottom: 20,
      },
      funFactTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFC300',
        marginBottom: 5,
      },
      divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginVertical: 15,
      },
    });

    const levelLabels: Record<string, string> = {
      starter: 'Starter (5-7)',
      explorer: 'Explorer (8-11)',
      thinker: 'Thinker (12-14)',
    };

    const docs = filteredContent.map((item) => {
      const title = getText(item.title, locale);
      const contentText = getText((item.content as any)[ageLevel], locale);
      const funFactText = getText(item.funFact, locale);

      return (
        <Page key={item.id} size="A4" style={styles.page}>
          <View style={styles.icon}>
            <Text>{item.emoji}</Text>
          </View>
          <Text style={styles.letterTitle}>{title}</Text>
          <Text style={{ fontSize: 11, textAlign: 'center', color: '#999', marginBottom: 20 }}>
            {levelLabels[ageLevel] || ageLevel}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{contentText}</Text>
          <View style={styles.divider} />
          <View style={styles.funFact}>
            <Text style={styles.funFactTitle}>Fun Fact!</Text>
            <Text>{funFactText}</Text>
          </View>
        </Page>
      );
    });

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.cover}>
            <Text style={{ fontSize: 60, textAlign: 'center', marginBottom: 20 }}>📖</Text>
            <Text style={styles.title}>The ABC of Islam</Text>
            <Text style={styles.subtitle}>
              A Journey Through 26 Topics of Faith
            </Text>
            <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
              {filteredContent.length} topics • {levelLabels[ageLevel] || ageLevel}
            </Text>
          </View>
        </Page>
        {docs}
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    const arrayBuffer = await pdfBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="abc-of-islam-${locale}${topicId ? `-${topicId}` : ''}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
