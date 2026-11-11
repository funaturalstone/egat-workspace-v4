# Minimal .xlsx reader (stdlib only): {sheet name: {(col, row): value}} using the cached values the file holds.
import zipfile, re, html, sys, json
import xml.etree.ElementTree as ET
NS={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def read(path):
    z=zipfile.ZipFile(path)
    wb=ET.fromstring(z.read('xl/workbook.xml'))
    rels=ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rid={r.get('Id'):r.get('Target') for r in rels}
    ss=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si',NS):
            ss.append(''.join(t.text or '' for t in si.iter('{%s}t'%NS['m'])))
    out={}
    for sh in wb.find('m:sheets',NS):
        tgt=rid[sh.get('{%s}id'%NS['r'])].lstrip('/'); tgt=tgt if tgt.startswith('xl/') else 'xl/'+tgt
        cells={}
        for c in ET.fromstring(z.read(tgt)).iter('{%s}c'%NS['m']):
            ref=c.get('r'); col=re.match(r'[A-Z]+',ref).group(0); row=int(ref[len(col):]); t=c.get('t'); v=c.find('m:v',NS)
            if t=='inlineStr': val=''.join(x.text or '' for x in c.iter('{%s}t'%NS['m']))
            elif v is None or v.text is None: continue
            elif t=='s': val=ss[int(v.text)]
            elif t in ('str','e'): val=v.text
            elif t=='b': val=v.text=='1'
            else: val=float(v.text)
            cells[(col,row)]=val
        out[sh.get('name')]=cells
    return out
