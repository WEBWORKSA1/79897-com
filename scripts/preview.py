#!/usr/bin/env python3
"""Local preview without Ruby: renders pages (front matter + _layouts/default.html + _includes) into _site/.
Supports only the small Liquid subset this site uses. GitHub Pages runs real Jekyll in production."""
import os, re, glob, shutil, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
cfg = yaml.safe_load(open('_config.yml'))
layout = open('_layouts/default.html', encoding='utf-8').read()
out = '_site'
shutil.rmtree(out, ignore_errors=True)
os.makedirs(out)
def includes(s):
    return re.sub(r'{%\s*include\s+([\w.\-]+)\s*%}', lambda m: open('_includes/' + m.group(1), encoding='utf-8').read(), s)
for f in glob.glob('*.html'):
    src = open(f, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', src, re.S)
    if not m:
        shutil.copy(f, out); continue
    fm = yaml.safe_load(m.group(1)) or {}
    body = includes(m.group(2))
    url = '/' + f
    html = layout.replace('{{ content }}', body)
    html = html.replace("{{ page.url | replace: 'index.html', '' }}", url.replace('index.html', ''))
    html = html.replace('{{ page.title }}', str(fm.get('title', ''))).replace('{{ page.description }}', str(fm.get('description', '')))
    html = html.replace('{{ page.jsonld }}', str(fm.get('jsonld', ''))).replace('{{ site.version }}', str(cfg.get('version', '1')))
    left = re.findall(r'{{.*?}}|{%.*?%}', html)
    if left: print('WARN unrendered liquid in', f, left[:3])
    open(os.path.join(out, f), 'w', encoding='utf-8').write(html)
skip = set(cfg.get('exclude', [])) | {'_site', '_layouts', '_includes', '_config.yml', '.git', '.gitignore'}
for p in os.listdir('.'):
    if p in skip or p.endswith('.html'): continue
    (shutil.copytree if os.path.isdir(p) else shutil.copy)(p, os.path.join(out, p))
print('Built', out)
