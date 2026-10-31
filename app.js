'use strict';
/* =========================================================
   Controle de Gastos — PWA com Google Planilhas
   ========================================================= */
const VERSAO = '1.0';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';
const DRIVE = 'https://www.googleapis.com/drive/v3/files';
const TITULO_PLANILHA = 'Controle de Gastos';
const HEAD = ['ID', 'Data', 'Tipo', 'Categoria', 'Item', 'Descrição', 'Valor', 'Forma', 'Cartão', 'Parcela', 'Grupo', 'Fixa', 'Chave'];
const FORMAS = ['Dinheiro', 'Débito', 'Pix', 'Crédito'];
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const PALETA = ['#2e7d32', '#d81b60', '#ef6c00', '#8e24aa', '#1e88e5', '#00897b', '#f9a825', '#c62828', '#5e35b1', '#00838f', '#6d4c41', '#607d8b', '#ff9900', '#cc092f', '#820ad1', '#e5007e'];
/* ícones simples (traço) */
const ICONS = {
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6.2"/>',
  saude: '<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6C19 16.5 12 21 12 21z"/><path d="M12 10v5M9.5 12.5h5"/>',
  combustivel: '<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M4 10h11"/><path d="M15 8l3 3v7a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  sacola: '<path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  outros: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  casa: '<path d="M3 11l9-8 9 8"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  casa2: '<path d="M2 20l6-9 3.5 5"/><path d="M12 20v-6.5l4.5-3.5 4.5 3.5V20z"/><path d="M2 20h20"/>',
  escola: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
  carro: '<path d="M5 16h14v-4l-2-5H7l-2 5z"/><path d="M5 12h14"/><circle cx="8" cy="17" r="1.8"/><circle cx="16" cy="17" r="1.8"/>',
  celular: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  onibus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16"/><path d="M7 18v3M17 18v3"/><circle cx="8" cy="14.5" r=".8"/><circle cx="16" cy="14.5" r=".8"/>',
  vela: '<rect x="8" y="10" width="8" height="11" rx="1"/><path d="M12 3c2 2.5 2 4.5 0 6-2-1.5-2-3.5 0-6z"/>',
  comida: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v6M9 3v6M17 21V3c-2.5 1-3.5 4-3.5 7.5S15 13 17 13"/>',
  estrela: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  trabalho: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  pet: '<circle cx="5" cy="11" r="2"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="6" r="2"/><circle cx="19" cy="11" r="2"/><path d="M12 13c-3 0-5.5 3-5.5 5.5 0 1.5 1.2 2.5 2.7 2.5 1.2 0 1.8-.6 2.8-.6s1.6.6 2.8.6c1.5 0 2.7-1 2.7-2.5C17.5 16 15 13 12 13z"/>',
  dinheiro: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  cartao: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  pix: '<path d="M12 3l9 9-9 9-9-9z"/><path d="M8.5 12L12 8.5l3.5 3.5-3.5 3.5z"/>',
  credito: '<rect x="2" y="7" width="17" height="12" rx="2"/><path d="M2 11h17"/><path d="M6 4h14a2 2 0 0 1 2 2v9"/>',
  mais: '<path d="M12 5v14M5 12h14"/>'
};
const ICONES_CAT = ['cart', 'saude', 'combustivel', 'sacola', 'comida', 'casa', 'casa2', 'escola', 'carro', 'onibus', 'celular', 'vela', 'trabalho', 'pet', 'estrela', 'outros'];
const COR_IC = { cart: '#2e7d32', saude: '#d81b60', combustivel: '#ef6c00', sacola: '#8e24aa', outros: '#607d8b', casa: '#1e88e5', casa2: '#00897b', escola: '#f9a825', carro: '#c62828', celular: '#5e35b1', onibus: '#00838f', vela: '#6d4c41' };
const FORMA_INFO = { Dinheiro: ['dinheiro', '#2e7d32'], 'Débito': ['cartao', '#1565c0'], Pix: ['pix', '#00897b'], 'Crédito': ['credito', '#7b1fa2'] };
const ALIAS = { 'Contas da casa de Teresópolis': 'Contas de Teresópolis' };
const svgIc = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.outros}</svg>`;
const bolinha = (n, cor, cls = '') => `<span class="ic ${cls}" style="--c:${cor}">${svgIc(n)}</span>`;
const icCat = k => k ? bolinha(k.icone, k.cor) : bolinha('outros', '#607d8b');

/* ---------------- utilidades ---------------- */
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = c => ((c || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = c => ((c || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pad2 = n => String(n).padStart(2, '0');
const hoje = () => { const d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
const mesAtual = () => hoje().slice(0, 7);
const addMes = (m, n) => { let [y, mm] = m.split('-').map(Number); mm += n; y += Math.floor((mm - 1) / 12); mm = ((mm - 1) % 12 + 12) % 12 + 1; return y + '-' + pad2(mm); };
const nomeMes = m => MESES[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4);
const nomeMesCurto = m => MESES[+m.slice(5, 7) - 1].slice(0, 3).toLowerCase() + '/' + m.slice(2, 4);
const diasNoMes = m => new Date(+m.slice(0, 4), +m.slice(5, 7), 0).getDate();
const dataCurta = d => d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '';
const ls = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ---------------- configuração padrão ---------------- */
function cfgPadrao() {
  const sub = (...n) => n.map(x => ({ id: uid(), nome: x }));
  const cat = (nome, tipo, icone, subs = []) => ({ id: uid(), nome, tipo, icone, cor: COR_IC[icone], subs });
  return {
    v: 2, inicio: mesAtual(),
    categorias: [
      cat('Mercado/Feira', 'variavel', 'cart'),
      cat('Saúde/Farmácia', 'variavel', 'saude'),
      cat('Combustível', 'variavel', 'combustivel'),
      cat('Compras', 'variavel', 'sacola'),
      cat('Outros', 'variavel', 'outros'),
      cat('Contas da casa', 'fixa', 'casa', sub('Luz', 'Internet', 'Gás', 'Aluguel')),
      cat('Contas de Teresópolis', 'fixa', 'casa2', sub('Luz', 'Internet', 'Água')),
      cat('Colégio do Pedro', 'fixa', 'escola'),
      cat('Seguro do carro', 'fixa', 'carro'),
      cat('Celular Samanta', 'fixa', 'celular'),
      cat('Transporte Pedro', 'fixa', 'onibus'),
      cat('Terreiro', 'fixa', 'vela', sub('Aluguel', 'Contadora')),
    ],
    cartoes: [
      { id: uid(), nome: 'Amazon', cor: '#ff9900', venc: '', fech: '' },
      { id: uid(), nome: 'Bradesco', cor: '#cc092f', venc: '', fech: '' },
      { id: uid(), nome: 'Nubank', cor: '#820ad1', venc: '', fech: '' },
      { id: uid(), nome: 'Méliuz', cor: '#e5007e', venc: '', fech: '' },
    ],
    fixos: {},          // chave -> [{de:'AAAA-MM', v:centavos}]  valor previsto das contas fixas
    entradasFixas: [],  // {id, nome, hist:[{de,v}], fim:'AAAA-MM'|null}
    iniciados: []       // meses em que as contas fixas já foram colocadas
  };
}
function normalizarCfg(c) {
  const p = cfgPadrao();
  c.categorias = c.categorias || p.categorias; c.cartoes = c.cartoes || p.cartoes;
  c.fixos = c.fixos || {}; c.entradasFixas = c.entradasFixas || []; c.iniciados = c.iniciados || [];
  c.inicio = c.inicio || mesAtual();
  const GUESS = [[/mercad|feira/i, 'cart'], [/sa[uú]de|farm/i, 'saude'], [/combust|gasol/i, 'combustivel'], [/compra/i, 'sacola'], [/teres/i, 'casa2'], [/casa/i, 'casa'], [/col[eé]gio|escola/i, 'escola'], [/carro|seguro/i, 'carro'], [/celular/i, 'celular'], [/transporte|[oô]nibus/i, 'onibus'], [/terreiro/i, 'vela']];
  c.categorias.forEach((k, i) => {
    k.subs = k.subs || [];
    if (!ICONS[k.icone]) { const g = GUESS.find(([r]) => r.test(k.nome)); k.icone = g ? g[1] : 'outros'; }
    if (!k.cor) k.cor = COR_IC[k.icone] || PALETA[i % PALETA.length];
  });
  if ((c.v || 1) < 2) {
    c.v = 2; c._mig = true;
    if (!c.categorias.some(k => /^outros?$/i.test(k.nome))) {
      const i = c.categorias.findIndex(k => k.tipo === 'fixa');
      c.categorias.splice(i < 0 ? c.categorias.length : i, 0, { id: uid(), nome: 'Outros', tipo: 'variavel', icone: 'outros', cor: '#607d8b', subs: [] });
    }
    const t = c.categorias.find(k => ALIAS[k.nome]); if (t) t.nome = ALIAS[t.nome];
  }
  return c;
}
const valorVigente = (hist, m) => { let v = null; (hist || []).slice().sort((a, b) => a.de < b.de ? -1 : 1).forEach(h => { if (h.de <= m) v = h.v; }); return v; };
const definirDaqui = (hist, m, v) => { const h = (hist || []).filter(x => x.de < m); h.push({ de: m, v }); return h; };
const entradaAtiva = (e, m) => valorVigente(e.hist, m) != null && (!e.fim || m < e.fim);
const chaveDe = (cat, sub) => cat.id + (sub ? ':' + sub.id : '');

/* ---------------- estado ---------------- */
const tok = ls.get('gx_tok', null);
const S = {
  cfg: null, mes: mesAtual(), tab: 'lancar', meses: {},
  dirty: new Set(ls.get('gx_dirty', [])),
  sid: ls.get('gx_sid', null), cid: ls.get('gx_cid', ''), demo: ls.get('gx_demo', false) || !!window.GX_PREVIEW,
  token: tok && tok.e > Date.now() ? tok.t : null, tokenExp: tok ? tok.e : 0,
  abas: {}, conectado: false, syncing: false, erroSync: null, carregando: false,
  form: null, modal: null, ask: null
};
const catPorId = id => S.cfg.categorias.find(k => k.id === id);
const catPorNome = n => S.cfg.categorias.find(k => k.nome === n || k.nome === ALIAS[n]);
const cartaoPorNome = n => S.cfg.cartoes.find(k => k.nome === n);
const linhasDe = m => S.meses[m] || [];
function setLinhas(m, rows) { S.meses[m] = rows; ls.set('gx_m_' + m, rows); }
function marcar(m) { S.dirty.add(m); ls.set('gx_dirty', [...S.dirty]); }
function salvarCfg() { ls.set('gx_cfg', S.cfg); marcar('_cfg'); }

/* =========================================================
   LOGIN GOOGLE (Google Identity Services)
   ========================================================= */
let tokenClient = null, esperando = null;
const gisPronto = () => !!(window.google && google.accounts && google.accounts.oauth2);
const tokenValido = () => !!S.token && Date.now() < S.tokenExp;
function initTokenClient() {
  if (tokenClient) return true;
  if (!gisPronto() || !S.cid) return false;
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: S.cid, scope: SCOPE,
    callback: r => {
      const w = esperando; esperando = null;
      if (r.error) { w && w.rej(new Error(r.error_description || r.error)); return; }
      S.token = r.access_token; S.tokenExp = Date.now() + (Number(r.expires_in || 3600) - 120) * 1000;
      ls.set('gx_tok', { t: S.token, e: S.tokenExp }); ls.set('gx_consent', true);
      w && w.res(S.token);
    },
    error_callback: e => {
      const w = esperando; esperando = null;
      const msg = e.type === 'popup_closed' ? 'Login cancelado.' :
        e.type === 'popup_failed_to_open' ? 'O celular bloqueou a janela de login. Toque de novo.' : 'Falha no login do Google.';
      w && w.rej(new Error(msg));
    }
  });
  return true;
}
function obterToken() {
  if (S.demo) return Promise.resolve('demo');
  if (tokenValido()) return Promise.resolve(S.token);
  if (esperando) return esperando.p;
  if (!initTokenClient()) return Promise.reject(new Error('O login do Google ainda não carregou. Confira a internet e tente de novo.'));
  let res, rej; const p = new Promise((a, b) => { res = a; rej = b; });
  esperando = { p, res, rej };
  try { tokenClient.requestAccessToken({ prompt: ls.get('gx_consent', false) ? '' : 'consent' }); }
  catch (e) { esperando = null; return Promise.reject(e); }
  return p;
}
async function precisaConexao() {
  if (S.demo) return;
  await obterToken();
  if (!S.conectado) await conectarPlanilha();
}

/* =========================================================
   GOOGLE PLANILHAS
   ========================================================= */
const rng = a => encodeURIComponent(a);
async function api(url, opt = {}) {
  const t = await obterToken();
  const r = await fetch(url, {
    method: opt.method || 'GET',
    headers: Object.assign({ Authorization: 'Bearer ' + t }, opt.body ? { 'Content-Type': 'application/json' } : {}),
    body: opt.body ? JSON.stringify(opt.body) : undefined
  });
  if (r.status === 401) { S.token = null; ls.del('gx_tok'); throw new Error('A sessão do Google expirou. Toque em sincronizar.'); }
  if (!r.ok) {
    let m = ''; try { const j = await r.json(); m = j.error && j.error.message; } catch (e) {}
    const err = new Error('Google respondeu ' + r.status + (m ? ': ' + m : '')); err.status = r.status; throw err;
  }
  return r.status === 204 ? null : r.json();
}
async function carregarAbas() {
  const s = await api(`${SHEETS}/${S.sid}?fields=sheets.properties(sheetId,title)`);
  S.abas = {}; (s.sheets || []).forEach(x => { S.abas[x.properties.title] = x.properties.sheetId; });
}
async function garantirPlanilha() {
  if (S.sid) {
    try { await carregarAbas(); return; }
    catch (e) { if (e.status !== 404 && e.status !== 403) throw e; S.sid = null; }
  }
  const q = encodeURIComponent("appProperties has { key='gastosApp' and value='1' } and trashed=false");
  const l = await api(`${DRIVE}?q=${q}&fields=files(id,name)&orderBy=createdTime`);
  if (l.files && l.files.length) S.sid = l.files[0].id;
  else {
    const s = await api(SHEETS, { method: 'POST', body: { properties: { title: TITULO_PLANILHA, locale: 'pt_BR', timeZone: 'America/Sao_Paulo' }, sheets: [{ properties: { title: '_config' } }] } });
    S.sid = s.spreadsheetId;
    await api(`${DRIVE}/${S.sid}`, { method: 'PATCH', body: { appProperties: { gastosApp: '1' } } });
  }
  ls.set('gx_sid', S.sid);
  await carregarAbas();
}
async function puxarCfg() {
  if (S.dirty.has('_cfg') && S.cfg) { await empurrarCfg(); return; }
  if (!('_config' in S.abas)) {
    await api(`${SHEETS}/${S.sid}:batchUpdate`, { method: 'POST', body: { requests: [{ addSheet: { properties: { title: '_config' } } }] } });
    await carregarAbas();
  }
  const r = await api(`${SHEETS}/${S.sid}/values/${rng('_config!A1')}`);
  const txt = r.values && r.values[0] && r.values[0][0];
  let c = null; if (txt) { try { c = JSON.parse(txt); } catch (e) {} }
  if (c) { S.cfg = normalizarCfg(c); ls.set('gx_cfg', S.cfg); if (S.cfg._mig) { delete S.cfg._mig; await empurrarCfg(); } }
  else { if (!S.cfg) S.cfg = cfgPadrao(); await empurrarCfg(); }
}
async function empurrarCfg() {
  await api(`${SHEETS}/${S.sid}/values/${rng('_config!A1:A2')}?valueInputOption=RAW`, {
    method: 'PUT', body: { values: [[JSON.stringify(S.cfg)], ['Configurações do app de gastos. Não apague nem edite esta aba.']] }
  });
  S.dirty.delete('_cfg'); ls.set('gx_dirty', [...S.dirty]);
}
async function garantirAbaMes(m) {
  if (m in S.abas) return;
  const idx = Object.keys(S.abas).filter(t => /^\d{4}-\d{2}$/.test(t) && t < m).length;
  const id = Math.floor(Math.random() * 1e9) + 1000;
  const col = c => ({ updateDimensionProperties: { range: { sheetId: id, dimension: 'COLUMNS', startIndex: c, endIndex: c + 1 }, properties: { hiddenByUser: true }, fields: 'hiddenByUser' } });
  await api(`${SHEETS}/${S.sid}:batchUpdate`, {
    method: 'POST', body: {
      requests: [
        { addSheet: { properties: { sheetId: id, title: m, index: idx, gridProperties: { frozenRowCount: 1, columnCount: 13 } } } },
        { repeatCell: { range: { sheetId: id, startRowIndex: 1, startColumnIndex: 6, endColumnIndex: 7 }, cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '"R$" #,##0.00' } } }, fields: 'userEnteredFormat.numberFormat' } },
        { repeatCell: { range: { sheetId: id, startRowIndex: 0, endRowIndex: 1 }, cell: { userEnteredFormat: { textFormat: { bold: true } } }, fields: 'userEnteredFormat.textFormat.bold' } },
        col(0), col(10), col(12)
      ]
    }
  });
  S.abas[m] = id;
}
function rowToSheet(r) {
  return [r.id, r.data, r.tipo === 'entrada' ? 'Entrada' : 'Saída', r.cat || '', r.sub || '', r.desc || '',
    r.valor == null ? '' : r.valor / 100, r.forma || '', r.cartao || '', r.parcela || '', r.grupo || '',
    r.fixa === 'conta' ? 'Conta fixa' : r.fixa === 'entrada' ? 'Entrada fixa' : '', r.chave || ''];
}
function paraCentavos(v) {
  if (v === '' || v == null) return null;
  if (typeof v === 'number') return Math.round(v * 100);
  const s = String(v).replace(/[^\d,.-]/g, '');
  const n = s.includes(',') ? parseFloat(s.replace(/\./g, '').replace(',', '.')) : parseFloat(s);
  return isNaN(n) ? null : Math.round(n * 100);
}
function paraData(v, m) {
  if (typeof v === 'number') { const d = new Date(Math.round((v - 25569) * 864e5)); return d.toISOString().slice(0, 10); }
  const s = String(v || '');
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const b = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); if (b) return b[3] + '-' + pad2(b[2]) + '-' + pad2(b[1]);
  return m + '-01';
}
function sheetToRow(a, m) {
  const g = i => a[i] == null ? '' : a[i];
  const fx = String(g(11));
  return {
    id: String(g(0)) || uid(), data: paraData(g(1), m), tipo: /entrada/i.test(g(2)) ? 'entrada' : 'saida',
    cat: String(g(3)), sub: String(g(4)), desc: String(g(5)), valor: paraCentavos(g(6)), forma: String(g(7)),
    cartao: String(g(8)), parcela: String(g(9)), grupo: String(g(10)),
    fixa: /conta/i.test(fx) ? 'conta' : /entrada/i.test(fx) ? 'entrada' : '', chave: String(g(12))
  };
}
async function puxarMes(m) {
  if (!(m in S.abas)) return [];
  const r = await api(`${SHEETS}/${S.sid}/values/${rng(`'${m}'!A2:M`)}?valueRenderOption=UNFORMATTED_VALUE`);
  return (r.values || []).filter(a => a.some(x => x !== '' && x != null)).map(a => sheetToRow(a, m));
}
async function empurrarMes(m) {
  const rows = ordenar(linhasDe(m));
  await garantirAbaMes(m);
  await api(`${SHEETS}/${S.sid}/values/${rng(`'${m}'!A2:M`)}:clear`, { method: 'POST', body: {} });
  await api(`${SHEETS}/${S.sid}/values/${rng(`'${m}'!A1`)}?valueInputOption=RAW`, { method: 'PUT', body: { values: [HEAD, ...rows.map(rowToSheet)] } });
}
function ordenar(rows) {
  const ordem = r => r.tipo === 'entrada' ? 0 : r.fixa === 'conta' ? 1 : 2;
  return rows.slice().sort((a, b) => ordem(a) - ordem(b) || (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
}

/* ---------------- sincronização ---------------- */
let fila = Promise.resolve();
function persistir() { fila = fila.then(sincronizarPendentes, sincronizarPendentes); return fila; }
async function sincronizarPendentes() {
  ls.set('gx_dirty', [...S.dirty]);
  if (S.demo) { S.dirty.clear(); ls.set('gx_dirty', []); return; }
  if (!S.dirty.size) return;
  if (!tokenValido() && !esperando) { S.erroSync = 'Há alterações para enviar. Toque em ⟳ para sincronizar.'; renderTopo(); return; }
  S.syncing = true; renderTopo();
  try {
    if (!S.conectado) await conectarPlanilha(true);
    for (const k of [...S.dirty]) {
      if (k === '_cfg') await empurrarCfg();
      else { await empurrarMes(k); S.dirty.delete(k); ls.set('gx_dirty', [...S.dirty]); }
    }
    S.erroSync = null;
  } catch (e) { S.erroSync = e.message; }
  S.syncing = false; renderTopo();
}
async function conectarPlanilha(semCfg) {
  await garantirPlanilha();
  if (!semCfg) await puxarCfg();
  S.conectado = true;
}
async function carregarMes(m) {
  // devolve as linhas de um mês, buscando na planilha quando possível
  if (S.demo) { if (!S.meses[m]) setLinhas(m, ls.get('gx_m_' + m, [])); return S.meses[m]; }
  if (S.dirty.has(m) && S.meses[m]) return S.meses[m];
  await precisaConexao();
  setLinhas(m, await puxarMes(m));
  return S.meses[m];
}

/* ---------------- abrir mês ---------------- */
async function abrirMes(m) {
  S.mes = m;
  if (!S.meses[m]) { const c = ls.get('gx_m_' + m, null); if (c) S.meses[m] = c; }
  render();
  let ok = S.demo;
  if (!S.demo && tokenValido()) {
    S.carregando = true; renderTopo();
    try {
      if (!S.conectado) await conectarPlanilha();
      if (S.dirty.size) await persistir();
      if (!S.dirty.has(m)) setLinhas(m, await puxarMes(m));
      ok = true; S.erroSync = null;
    } catch (e) { S.erroSync = e.message; }
    S.carregando = false;
  }
  if (S.demo && !S.meses[m]) setLinhas(m, []);
  if (ok && iniciarMes(m)) persistir();
  render(); atualizarLembrete();
}
function novaPendente(m, k, s) {
  return { id: uid(), data: m + '-01', tipo: 'saida', cat: k.nome, sub: s ? s.nome : '', desc: '', valor: null, forma: '', cartao: '', parcela: '', grupo: '', fixa: 'conta', chave: chaveDe(k, s) };
}
function novaEntradaFixaRow(m, e) {
  return { id: uid(), data: m + '-01', tipo: 'entrada', cat: '', sub: '', desc: e.nome, valor: valorVigente(e.hist, m), forma: '', cartao: '', parcela: '', grupo: '', fixa: 'entrada', chave: e.id };
}
function iniciarMes(m) {
  const c = S.cfg;
  if (m > mesAtual() || m < c.inicio || c.iniciados.includes(m)) return false;
  const rows = linhasDe(m).slice();
  c.categorias.filter(k => k.tipo === 'fixa').forEach(k => (k.subs.length ? k.subs : [null]).forEach(s => {
    if (!rows.some(r => r.chave === chaveDe(k, s))) rows.push(novaPendente(m, k, s));
  }));
  c.entradasFixas.forEach(e => { if (entradaAtiva(e, m) && !rows.some(r => r.chave === e.id)) rows.push(novaEntradaFixaRow(m, e)); });
  c.iniciados.push(m); salvarCfg();
  setLinhas(m, rows); marcar(m);
  return true;
}
// mantém as contas fixas pendentes do mês atual de acordo com as categorias
function ajustarPendentes(novasChaves = []) {
  const m = mesAtual(); const c = S.cfg;
  if (!c.iniciados.includes(m) || !S.meses[m]) return;
  const rows = S.meses[m]; const mapa = new Map();
  c.categorias.filter(k => k.tipo === 'fixa').forEach(k => (k.subs.length ? k.subs : [null]).forEach(s => mapa.set(chaveDe(k, s), [k, s])));
  let mud = false;
  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i]; if (r.fixa !== 'conta') continue;
    const ks = mapa.get(r.chave);
    if (!ks) { if (r.valor == null) { rows.splice(i, 1); mud = true; } continue; }
    const [k, s] = ks; const sn = s ? s.nome : '';
    if (r.cat !== k.nome || r.sub !== sn) { r.cat = k.nome; r.sub = sn; mud = true; }
  }
  novasChaves.forEach(ch => { const ks = mapa.get(ch); if (ks && !rows.some(r => r.chave === ch)) { rows.push(novaPendente(m, ks[0], ks[1])); mud = true; } });
  if (mud) { setLinhas(m, rows); marcar(m); }
}
async function aplicarDepois(m, fn) {
  const meses = S.cfg.iniciados.filter(x => x > m).sort();
  if (!meses.length) return;
  await precisaConexao();
  for (const x of meses) { const rows = await carregarMes(x); fn(rows, x); setLinhas(x, rows); marcar(x); }
}

/* =========================================================
   CÁLCULOS
   ========================================================= */
function resumo(m) {
  const rows = linhasDe(m);
  const ent = rows.filter(r => r.tipo === 'entrada' && r.valor != null);
  const sai = rows.filter(r => r.tipo === 'saida' && r.valor != null);
  const pend = rows.filter(r => r.fixa === 'conta' && r.valor == null);
  const totE = ent.reduce((a, r) => a + r.valor, 0), totS = sai.reduce((a, r) => a + r.valor, 0);
  const previsto = pend.reduce((a, r) => a + (valorVigente(S.cfg.fixos[r.chave], m) || 0), 0);
  const porCat = {}, porCartao = {}, porForma = {};
  sai.forEach(r => {
    const cn = ALIAS[r.cat] || r.cat || 'Outros'; porCat[cn] = (porCat[cn] || 0) + r.valor;
    if (r.forma === 'Crédito') porCartao[r.cartao || '?'] = (porCartao[r.cartao || '?'] || 0) + r.valor;
    else if (r.forma) porForma[r.forma] = (porForma[r.forma] || 0) + r.valor;
  });
  return { ent, sai, pend, totE, totS, sobra: totE - totS, previsto, porCat, porCartao, porForma };
}
const pendentesMesAtual = () => linhasDe(mesAtual()).filter(r => r.fixa === 'conta' && r.valor == null);
const nomeLinha = r => r.tipo === 'entrada' ? (r.desc || 'Entrada') : (r.cat + (r.sub ? ' · ' + r.sub : ''));

/* =========================================================
   ÍCONES
   ========================================================= */
const IC = {
  lancar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>',
  resumo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>'
};

/* =========================================================
   RENDERIZAÇÃO
   ========================================================= */
const app = document.getElementById('app');
function render() {
  if (!S.demo && (!S.cid || !S.cfg || !S.sid)) { renderBoasVindas(); return; }
  const pend = pendentesMesAtual().length;
  document.getElementById('tabs').innerHTML = ['lancar', 'resumo', 'ajustes'].map(t =>
    `<button class="${S.tab === t ? 'on' : ''}" data-a="tab" data-v="${t}">${IC[t]}<span>${{ lancar: 'Lançar', resumo: 'Resumo', ajustes: 'Ajustes' }[t]}</span>${t === 'lancar' && pend ? `<span class="badge">${pend}</span>` : ''}</button>`).join('');
  let h = '';
  if (S.tab === 'lancar') h = telaLancar();
  else if (S.tab === 'resumo') h = telaResumo();
  else h = telaAjustes();
  app.innerHTML = h;
  renderTopo();
}
function topo() {
  return `<div class="top">
    <button class="icbtn" data-a="mes" data-v="-1" aria-label="Mês anterior">‹</button>
    <div class="mes">${nomeMes(S.mes)}</div>
    <button class="icbtn" data-a="mes" data-v="1" aria-label="Próximo mês">›</button>
    <button class="icbtn st" id="st" data-a="sync" aria-label="Sincronizar"></button>
  </div>${S.mes !== mesAtual() ? `<div class="alerta-mes"><b>⚠️ Você está em ${nomeMes(S.mes)}</b><span>Este não é o mês atual. O que lançar aqui fica em ${MESES[+S.mes.slice(5, 7) - 1].toLowerCase()}.</span><button class="btn" data-a="mes-atual">Voltar para ${nomeMes(mesAtual())}</button></div>` : ''}<div id="aviso"></div>`;
}
function renderTopo() {
  const st = document.getElementById('st'); if (!st) return;
  if (S.demo) { st.textContent = '🧪'; st.className = 'icbtn st'; st.title = 'Modo de teste'; }
  else if (S.syncing || S.carregando) { st.textContent = '⏳'; st.className = 'icbtn st'; }
  else if (S.erroSync || S.dirty.size || !tokenValido()) { st.textContent = '⟳'; st.className = 'icbtn st err'; }
  else { st.textContent = '✓'; st.className = 'icbtn st ok'; }
  const av = document.getElementById('aviso'); if (!av) return;
  let msg = '';
  if (S.demo) msg = '';
  else if (S.erroSync) msg = S.erroSync;
  else if (!tokenValido() && !S.syncing) msg = 'Toque aqui para conectar ao Google e ver seus dados atualizados.';
  av.innerHTML = msg ? `<button class="banner info" data-a="sync">⟳ <span>${esc(msg)}</span></button>` : '';
}

function itemLinha(r) {
  const m = S.mes;
  if (r.tipo === 'entrada') {
    return `<button class="item" data-a="editar" data-id="${r.id}">${bolinha('dinheiro', '#2e7d32')}<span class="tx"><b>${esc(r.desc || 'Entrada')}</b><small>${dataCurta(r.data)}${r.fixa ? ' · Entrada fixa' : ''}</small></span><span class="val in">${r.valor == null ? '—' : fmt(r.valor)}</span></button>`;
  }
  const k = catPorNome(r.cat); const ic = icCat(k);
  if (r.fixa === 'conta') {
    const titulo = r.sub || r.cat;
    const sub = r.sub ? r.cat : 'Conta fixa';
    let val;
    if (r.valor == null) { const sg = valorVigente(S.cfg.fixos[r.chave], m); val = `<span class="val pend">Pendente${sg != null ? `<small>previsto ${fmt(sg)}</small>` : ''}</span>`; }
    else val = `<span class="val">${fmt(r.valor)}</span>`;
    const det = r.valor == null ? esc(sub) : esc(sub) + ' · ' + formaHtml(r);
    return `<button class="item" data-a="editar" data-id="${r.id}">${ic}<span class="tx"><b>${esc(titulo)}</b><small>${det}</small></span>${val}</button>`;
  }
  const titulo = r.cat + (r.sub ? ' · ' + r.sub : '');
  const det = [dataCurta(r.data), formaHtml(r), r.parcela ? `<span class="tag">${esc(r.parcela)}</span>` : '', r.desc ? esc(r.desc) : ''].filter(Boolean).join(' · ');
  return `<button class="item" data-a="editar" data-id="${r.id}">${ic}<span class="tx"><b>${esc(titulo)}</b><small>${det}</small></span><span class="val">${fmt(r.valor)}</span></button>`;
}
function formaHtml(r) {
  if (r.forma === 'Crédito') { const c = cartaoPorNome(r.cartao); return `<span class="dot" style="background:${c ? c.cor : '#999'}"></span>${esc(r.cartao || 'Crédito')}`; }
  const fi = FORMA_INFO[r.forma]; return fi ? `<span class="dot" style="background:${fi[1]}"></span>${esc(r.forma)}` : esc(r.forma || '');
}

function painel(m, grande) {
  const R = resumo(m);
  return `<${grande ? 'div' : 'button data-a="tab" data-v="resumo"'} class="painel">
    <div class="p ent"><small>Entradas</small><b>${fmt(R.totE)}</b></div>
    <div class="p sai"><small>Saídas</small><b>${fmt(R.totS)}</b></div>
    <div class="p sob ${R.sobra < 0 ? 'neg' : ''}"><small>Quanto sobrou</small><b>${fmt(R.sobra)}</b></div>
  </${grande ? 'div' : 'button'}>`;
}
function telaLancar() {
  const m = S.mes; const rows = linhasDe(m);
  const fixas = rows.filter(r => r.fixa === 'conta');
  const ordemCat = n => { const i = S.cfg.categorias.findIndex(k => k.nome === n); return i < 0 ? 999 : i; };
  fixas.sort((a, b) => ordemCat(a.cat) - ordemCat(b.cat) || subIdx(a) - subIdx(b));
  const gastos = rows.filter(r => r.tipo === 'saida' && r.fixa !== 'conta').sort((a, b) => a.data < b.data ? 1 : a.data > b.data ? -1 : 0);
  const pend = fixas.filter(r => r.valor == null).length;
  let h = topo() + painel(m);
  if (m > mesAtual() && !fixas.length) h += `<div class="banner info"><span>Mês futuro: aqui aparecem só as parcelas. As contas fixas entram quando o mês chegar.</span></div>`;
  if (fixas.length) h += `<h2 id="fixas">Contas fixas <span class="${pend ? 'pill-pend' : 'pill-ok'}">${pend ? `${pend} pendente${pend > 1 ? 's' : ''}` : 'todas pagas ✓'}</span></h2><div class="card">${fixas.map(itemLinha).join('')}</div>`;
  h += `<h2>Gastos do mês</h2><div class="card">${gastos.length ? gastos.map(itemLinha).join('') : '<div class="vazio">Nenhum gasto ainda.<br>Toque em <b>Lançar gasto</b>.</div>'}</div>`;
  h += `<button class="fab" data-a="novo-gasto">${svgIc('mais')}<span>Lançar gasto</span></button>`;
  return h;
}
function subIdx(r) { const k = catPorNome(r.cat); if (!k) return 0; const i = k.subs.findIndex(s => s.nome === r.sub); return i < 0 ? 99 : i; }

function telaResumo() {
  const m = S.mes; const R = resumo(m);
  let h = topo();
  h += painel(m, true);
  if (R.pend.length) h += `<div class="banner"><span>Faltam ${R.pend.length} ${R.pend.length === 1 ? 'conta fixa' : 'contas fixas'}${R.previsto ? ` (previsto ${fmt(R.previsto)}). Depois de pagar, sobraria ${fmt(R.sobra - R.previsto)}` : ''}.</span></div>`;
  h += `<h2>Entradas</h2><div class="card">${linhasDe(m).filter(r => r.tipo === 'entrada').map(itemLinha).join('') || '<div class="vazio">Nenhuma entrada neste mês.</div>'}</div>
    <button class="btn" data-a="nova-entrada">＋ Adicionar entrada</button>`;
  const nomesCat = S.cfg.categorias.map(k => k.nome); Object.keys(R.porCat).forEach(n => { if (!nomesCat.includes(n)) nomesCat.push(n); });
  const cats = nomesCat.map(n => [n, R.porCat[n] || 0]).sort((a, b) => b[1] - a[1]);
  h += `<h2>Por categoria</h2><div class="card">${cats.map(([n, v]) => {
    const k = catPorNome(n); const p = R.totS ? Math.round(v / R.totS * 100) : 0;
    return `<div class="linha cat-l ${v ? '' : 'zero'}">${icCat(k)}<div class="cl"><div class="lr"><span>${esc(n)}</span><span>${fmt(v)}</span></div>${v ? `<div class="barra"><i style="width:${Math.max(p, 2)}%;background:${k ? k.cor : '#607d8b'}"></i></div><small>${p}% do total</small>` : ''}</div></div>`;
  }).join('')}</div>`;
  const nomes = S.cfg.cartoes.map(c => c.nome); Object.keys(R.porCartao).forEach(n => { if (!nomes.includes(n)) nomes.push(n); });
  const totCred = Object.values(R.porCartao).reduce((a, b) => a + b, 0);
  h += `<h2>Por cartão</h2><div class="card">${nomes.map(n => {
    const c = cartaoPorNome(n); const v = R.porCartao[n] || 0;
    const info = c ? [c.fech ? 'fecha dia ' + c.fech : '', c.venc ? 'vence dia ' + c.venc : ''].filter(Boolean).join(' · ') : '';
    return `<div class="linha cat-l">${bolinha('cartao', c ? c.cor : '#999')}<div class="cl"><div class="lr"><span>${esc(n)}</span><span style="${v ? '' : 'color:var(--muted)'}">${fmt(v)}</span></div>${info ? `<small>${info}</small>` : ''}</div></div>`;
  }).join('')}<div class="linha"><div class="lr"><span>Total no crédito</span><span>${fmt(totCred)}</span></div></div></div>`;
  const formas = FORMAS.filter(f => f !== 'Crédito');
  h += `<h2>Outras formas</h2><div class="card">${formas.map(f => `<div class="linha cat-l">${bolinha(FORMA_INFO[f][0], FORMA_INFO[f][1])}<div class="cl"><div class="lr"><span>${f}</span><span>${fmt(R.porForma[f] || 0)}</span></div></div></div>`).join('')}</div>`;
  return h;
}

function telaAjustes() {
  const c = S.cfg; const tema = ls.get('gx_tema', 'auto');
  let h = `<div class="top"><div class="mes">Ajustes</div></div>`;
  h += `<h2>Aparência</h2><div class="seg">${[['light', '☀️ Claro'], ['dark', '🌙 Escuro'], ['auto', 'Automático']].map(([v, n]) => `<button class="${tema === v ? 'on' : ''}" data-a="tema" data-v="${v}">${n}</button>`).join('')}</div>`;
  h += `<h2>Cartões</h2><div class="card">${c.cartoes.map(k => `<button class="item" data-a="cartao" data-id="${k.id}">${bolinha('cartao', k.cor)}<span class="tx"><b>${esc(k.nome)}</b><small>${[k.fech ? 'Fecha dia ' + k.fech : '', k.venc ? 'Vence dia ' + k.venc : ''].filter(Boolean).join(' · ') || 'Toque para editar'}</small></span><span class="val">›</span></button>`).join('') || '<div class="vazio">Nenhum cartão.</div>'}</div>
    <button class="btn" data-a="cartao">＋ Adicionar cartão</button>`;
  const lista = tipo => c.categorias.filter(k => k.tipo === tipo).map(k => `<button class="item" data-a="categoria" data-id="${k.id}">${icCat(k)}<span class="tx"><b>${esc(k.nome)}</b><small>${k.subs.length ? esc(k.subs.map(s => s.nome).join(', ')) : 'Sem itens'}</small></span><span class="val">›</span></button>`).join('');
  h += `<h2>Categorias variáveis</h2><div class="card">${lista('variavel') || '<div class="vazio">Nenhuma.</div>'}</div>`;
  h += `<h2>Contas fixas</h2><div class="card">${lista('fixa') || '<div class="vazio">Nenhuma.</div>'}</div>
    <button class="btn" data-a="categoria">＋ Adicionar categoria</button>`;
  const m = mesAtual();
  h += `<h2>Entradas fixas</h2><div class="card">${c.entradasFixas.map(e => {
    const ativa = entradaAtiva(e, m) || (valorVigente(e.hist, m) == null && !e.fim);
    return `<button class="item" data-a="ef" data-id="${e.id}">${bolinha('dinheiro', '#2e7d32')}<span class="tx"><b>${esc(e.nome)}</b><small>${ativa ? 'Todo mês' : 'Encerrada a partir de ' + nomeMesCurto(e.fim)}</small></span><span class="val in">${fmt(valorVigente(e.hist, m) ?? e.hist[e.hist.length - 1].v)}</span></button>`;
  }).join('') || '<div class="vazio">Nenhuma. Crie em Resumo → Adicionar entrada, marcando "Entrada fixa".</div>'}</div>`;
  const perm = ('Notification' in window) ? Notification.permission : 'indisponivel';
  h += `<h2>Lembretes</h2><div class="card pad">${perm === 'granted' ? '✅ Notificações ativadas. Quando houver contas fixas pendentes, o app avisa (ao fechar o app e, se o Android permitir, uma vez por dia).' :
    perm === 'denied' ? '🚫 As notificações estão bloqueadas. Libere em Configurações do Android → Apps → Gastos → Notificações.' :
    perm === 'indisponivel' ? 'Este navegador não suporta notificações. Os lembretes aparecem dentro do app.' :
    'Ative para receber aviso de contas fixas pendentes.'}
    ${perm === 'default' ? '<button class="btn pri" data-a="notif">🔔 Ativar lembretes</button>' : ''}</div>`;
  if (S.demo) {
    h += window.GX_PREVIEW ? `<h2>Prévia</h2><div class="card pad">Esta é uma prévia com dados de exemplo. No app publicado, tudo é gravado na sua planilha do Google.</div>`
      : `<h2>Modo de teste</h2><div class="card pad">Você está usando o app sem Google. Os dados ficam só neste aparelho.
      <button class="btn pri" data-a="sair-demo">Sair do modo de teste e conectar ao Google</button></div>`;
  } else {
    h += `<h2>Google Planilhas</h2><div class="card pad">
      ${S.sid ? `<a class="btn pri" href="https://docs.google.com/spreadsheets/d/${esc(S.sid)}" target="_blank" rel="noopener" style="text-decoration:none">📄 Abrir minha planilha</a>` : ''}
      <button class="btn" data-a="sync">⟳ Sincronizar agora</button>
      <button class="btn lnk" data-a="trocar-cid">Trocar o ID do cliente</button>
      <button class="btn dng" data-a="sair">Sair da conta Google</button></div>`;
  }
  h += `<p class="nota" style="text-align:center;margin:24px 0">Controle de Gastos · versão ${VERSAO}</p>`;
  return h;
}

function renderBoasVindas() {
  document.getElementById('tabs').innerHTML = '';
  let h = `<div class="welcome"><img class="logo" src="icons/icon-192.png" alt=""><h1>Controle de Gastos</h1>`;
  if (!S.cid) {
    h += `<p>Para guardar seus gastos na sua planilha do Google, cole abaixo o <b>ID do cliente</b> que você criou no Google Cloud.</p>
      <label class="lb" for="cid">ID do cliente</label>
      <input class="inp" id="cid" data-i="cid" placeholder="123456-abc.apps.googleusercontent.com" autocomplete="off" autocapitalize="off" spellcheck="false">
      <button class="btn pri" data-a="salvar-cid">Continuar</button>
      <p class="nota">Ainda não tem o código? Siga o passo a passo que veio junto com o app.</p>
      <button class="btn" data-a="demo">🧪 Experimentar sem Google (modo de teste)</button>`;
  } else {
    h += `<p>Entre com sua conta Google. Na primeira vez o app cria a planilha <b>"${TITULO_PLANILHA}"</b> no seu Google Drive.</p>
      <p class="nota">Se aparecer "O Google não verificou este app", toque em <b>Continuar</b>: o app é seu.</p>
      <button class="btn pri" data-a="entrar">Entrar com Google</button>
      <button class="btn lnk" data-a="trocar-cid">Trocar o ID do cliente</button>`;
  }
  h += `</div>`;
  app.innerHTML = h;
}

/* =========================================================
   FORMULÁRIO DE GASTO
   ========================================================= */
function dataPadrao(m) { const h = hoje(); return h.slice(0, 7) === m ? h : m + '-' + pad2(Math.min(+h.slice(8, 10), diasNoMes(m))); }
function abrirGasto(row) {
  const m = S.mes;
  if (row) {
    const k = catPorNome(row.cat) || (row.chave ? catPorId(row.chave.split(':')[0]) : null);
    const s = k ? (k.subs.find(x => row.chave && row.chave.endsWith(':' + x.id)) || k.subs.find(x => x.nome === row.sub)) : null;
    const c = cartaoPorNome(row.cartao);
    S.form = { id: row.id, m, catId: k ? k.id : '', subId: s ? s.id : '', valor: row.valor || 0, forma: row.forma || '', cartaoId: c ? c.id : '',
      modo: 'vista', n: 2, desc: row.desc || '', data: row.data || dataPadrao(m), fixa: row.fixa, chave: row.chave, parcela: row.parcela, grupo: row.grupo,
      catNome: row.cat, subNome: row.sub, cartaoNome: row.cartao, pendente: row.valor == null };
    if (row.fixa === 'conta' && row.valor == null) { const sg = valorVigente(S.cfg.fixos[row.chave], m); if (sg != null) S.form.valor = sg; }
  } else {
    S.form = { id: null, m, catId: '', subId: '', valor: 0, forma: '', cartaoId: '', modo: 'vista', n: 2, desc: '', data: dataPadrao(m), fixa: '' };
  }
  S.modal = 'gasto'; renderModal();
  if (!row) { const i = document.querySelector('[data-i=valor]'); if (i) i.focus(); }
}
function renderModal() {
  const el = document.getElementById('modal');
  if (!S.modal) { el.innerHTML = ''; document.body.style.overflow = ''; return; }
  const ov = el.querySelector('.ovl'); const sc = ov ? ov.scrollTop : 0;
  const f = { gasto: modalGasto, entrada: modalEntrada, cartao: modalCartao, categoria: modalCategoria, ef: modalEF }[S.modal]();
  el.innerHTML = `<div class="ovl"><div class="box">${f}</div></div>`;
  if (!histModal) { histModal = true; try { history.pushState({ modal: 1 }, ''); } catch (e) {} }
  document.body.style.overflow = 'hidden';
  el.querySelector('.ovl').scrollTop = sc;
}
function cabecalho(t) { return `<div class="mhead"><button class="icbtn" data-a="fechar" aria-label="Fechar">✕</button><h1>${t}</h1></div>`; }
function campoValor(v) { return `<div class="money"><span>R$</span><input data-i="valor" inputmode="numeric" autocomplete="off" value="${fmtN(v)}" aria-label="Valor"></div>`; }

function modalGasto() {
  const f = S.form; const c = S.cfg;
  const cat = catPorId(f.catId);
  const ehParcela = !!f.grupo; const ehFixa = f.fixa === 'conta';
  let h = cabecalho(f.id ? (ehFixa ? 'Conta fixa' : 'Editar gasto') : 'Novo gasto');
  if (f.m !== mesAtual()) h += `<div class="alerta-mes mini"><b>⚠️ Lançando em ${nomeMes(f.m)}</b><span>Não é o mês atual.</span></div>`;
  if (ehFixa) h += `<div class="fixa-t">${icCat(cat)}<div><b>${esc(f.subNome || f.catNome)}</b><small>${esc(f.subNome ? f.catNome : 'Conta fixa')} · ${nomeMes(f.m)}</small></div></div>`;
  // 1º valor
  h += `<label class="lb">${!f.id && f.forma === 'Crédito' && f.modo === 'parc' ? 'Valor total da compra' : ehParcela ? 'Valor desta parcela' : 'Valor'}</label>${campoValor(f.valor)}`;
  if (ehFixa && f.pendente) { const sg = valorVigente(c.fixos[f.chave], f.m); h += `<p class="nota">${sg != null ? 'Já preenchido com o valor previsto. Altere se veio diferente.' : 'Digite o valor que veio este mês.'}</p>`; }
  // 2º categoria (só as variáveis; contas fixas são preenchidas na lista)
  if (!ehFixa) {
    const ks = c.categorias.filter(k => k.tipo === 'variavel' || k.id === f.catId);
    h += `<label class="lb">Categoria</label><div class="cats">${ks.map(k => `<button class="cat ${f.catId === k.id ? 'sel' : ''}" style="--c:${k.cor}" data-a="f-cat" data-id="${k.id}">${icCat(k)}<span>${esc(k.nome)}</span></button>`).join('')}</div>`;
    if (cat && cat.subs.length) {
      h += `<label class="lb">Item${cat.tipo === 'variavel' ? ' (opcional)' : ''}</label><div class="chips">${cat.subs.map(s => `<button class="opt ${f.subId === s.id ? 'sel' : ''}" data-a="f-sub" data-id="${s.id}">${esc(s.nome)}</button>`).join('')}</div>`;
    }
  }
  // 3º forma de pagamento
  if (ehParcela) {
    h += `<label class="lb">Cartão · parcela ${esc(f.parcela)}</label>${chipsCartao(f)}`;
  } else {
    h += `<label class="lb">Forma de pagamento</label><div class="g4">${FORMAS.map(x => `<button class="opt forma ${f.forma === x ? 'sel' : ''}" style="--c:${FORMA_INFO[x][1]}" data-a="f-forma" data-v="${x}">${bolinha(FORMA_INFO[x][0], FORMA_INFO[x][1], 'sm')}${x}</button>`).join('')}</div>`;
    if (f.forma === 'Crédito') {
      h += `<label class="lb">Cartão</label>${chipsCartao(f)}`;
      if (!f.id) {
        h += `<label class="lb">Como foi?</label><div class="seg"><button class="${f.modo === 'vista' ? 'on' : ''}" data-a="f-modo" data-v="vista">À vista</button><button class="${f.modo === 'parc' ? 'on' : ''}" data-a="f-modo" data-v="parc">Parcelado</button></div>`;
        if (f.modo === 'parc') {
          h += `<label class="lb">Número de parcelas</label><div class="stepper"><button data-a="f-n" data-v="-1" aria-label="Menos">−</button><b>${f.n}x</b><button data-a="f-n" data-v="1" aria-label="Mais">+</button></div>
            <p class="nota" id="prev-parc">${previaParcelas(f)}</p>`;
        }
      }
    }
  }
  h += `<label class="lb" for="fdesc">Descrição (opcional)</label><input class="inp" id="fdesc" data-i="desc" value="${esc(f.desc)}" placeholder="Ex.: farmácia do centro">`;
  if (!ehFixa) h += `<label class="lb" for="fdata">Data</label><input class="inp" id="fdata" type="date" data-i="data" value="${esc(f.data)}" min="${f.m}-01" max="${f.m}-${pad2(diasNoMes(f.m))}">`;
  h += `<button class="btn pri" data-a="f-salvar">${ehFixa && f.pendente ? '✓ Marcar como paga' : 'Salvar'}</button>`;
  if (f.id) {
    if (ehFixa && !f.pendente) h += `<button class="btn" data-a="f-pendente">Voltar para pendente</button>`;
    h += `<button class="btn dng" data-a="f-excluir">${ehFixa ? 'Remover deste mês' : 'Excluir'}</button>`;
  }
  return h;
}
function chipsCartao(f) {
  return `<div class="chips">${S.cfg.cartoes.map(k => `<button class="opt ${f.cartaoId === k.id ? 'sel' : ''}" style="--c:${k.cor}" data-a="f-cartao" data-id="${k.id}">${bolinha('cartao', k.cor, 'sm')}${esc(k.nome)}</button>`).join('') || '<p class="nota">Cadastre um cartão em Ajustes.</p>'}</div>`;
}
function previaParcelas(f) {
  if (!f.valor) return `Digite o valor total para ver as parcelas.`;
  const b = Math.floor(f.valor / f.n), r = f.valor - b * f.n;
  return `${f.n}x de ${fmt(b)}${r ? ` (a 1ª fica ${fmt(b + r)})` : ''}, de ${nomeMesCurto(f.m)} a ${nomeMesCurto(addMes(f.m, f.n - 1))}.`;
}

/* ---------- perguntas (Só este mês / Este e os próximos) ---------- */
function perguntar(titulo, texto, opcoes) {
  return new Promise(res => {
    S.ask = { res };
    document.getElementById('ask').innerHTML = `<div class="ovl" data-a="ask-fora"><div class="sheet" role="dialog"><h1>${esc(titulo)}</h1><p>${texto}</p>
      ${opcoes.map(([v, n], i) => `<button class="btn ${i === 0 ? 'pri' : ''}" data-a="ask" data-v="${v}">${esc(n)}</button>`).join('')}
      <button class="btn lnk" data-a="ask" data-v="">Cancelar</button></div></div>`;
  });
}
function responder(v) { const a = S.ask; S.ask = null; document.getElementById('ask').innerHTML = ''; a && a.res(v || null); }
const MES_OU_PROX = [['mes', 'Só este mês'], ['prox', 'Este e os próximos meses']];

/* ---------- salvar gasto ---------- */
async function salvarGasto() {
  const f = S.form; const c = S.cfg; const m = f.m;
  const cat = catPorId(f.catId);
  if (f.fixa !== 'conta') {
    if (!cat) return toast('Escolha a categoria');
    if (cat.tipo === 'fixa' && cat.subs.length && !f.subId) return toast('Escolha o item');
  }
  if (!f.valor) return toast('Digite o valor');
  if (!f.grupo && !f.forma) return toast('Escolha a forma de pagamento');
  if ((f.forma === 'Crédito' || f.grupo) && !f.cartaoId) return toast('Escolha o cartão');
  const sub = cat ? cat.subs.find(s => s.id === f.subId) : null;
  const cartao = c.cartoes.find(x => x.id === f.cartaoId);
  const forma = f.grupo ? 'Crédito' : f.forma;
  const campos = { forma, cartao: forma === 'Crédito' && cartao ? cartao.nome : '', desc: f.desc.trim() };
  if (f.fixa !== 'conta') Object.assign(campos, { cat: cat.nome, sub: sub ? sub.nome : '', data: f.data });
  let rows = linhasDe(m).slice();

  if (!f.id) {
    if (forma === 'Crédito' && f.modo === 'parc' && f.n > 1) {
      await novaCompraParcelada(Object.assign({ tipo: 'saida' }, campos), f.valor, f.n, m);
    } else {
      const chave = cat.tipo === 'fixa' ? chaveDe(cat, sub) : '';
      const pend = chave && rows.find(r => r.chave === chave && r.fixa === 'conta' && r.valor == null);
      if (pend) {
        if (!(await valorFixo(pend, f.valor, m))) return;
        Object.assign(pend, campos, { data: f.data });
      } else {
        rows.push(Object.assign({ id: uid(), tipo: 'saida', valor: f.valor, parcela: '', grupo: '', fixa: '', chave: '' }, campos));
      }
      setLinhas(m, rows); marcar(m);
    }
  } else {
    const r = rows.find(x => x.id === f.id); if (!r) return fecharModal();
    if (r.fixa === 'conta') {
      if (!(await valorFixo(r, f.valor, m))) return;
      Object.assign(r, campos);
      if (f.pendente && r.data === m + '-01' && hoje().slice(0, 7) === m) r.data = hoje();
      setLinhas(m, rows); marcar(m);
    } else if (r.grupo) {
      const mudou = r.valor !== f.valor || r.cat !== campos.cat || r.sub !== campos.sub || r.cartao !== campos.cartao || r.desc !== campos.desc;
      let esc2 = 'mes';
      const [i, n] = (r.parcela || '1/1').split('/').map(Number);
      if (mudou && i < n) { esc2 = await perguntar('Compra parcelada', 'Aplicar a alteração:', [['mes', 'Só esta parcela'], ['prox', 'Esta e as próximas parcelas']]); if (!esc2) return; }
      const novo = { valor: f.valor, cat: campos.cat, sub: campos.sub, cartao: campos.cartao, desc: campos.desc };
      Object.assign(r, novo, { data: f.data }); setLinhas(m, rows); marcar(m);
      if (esc2 === 'prox') {
        try {
          await precisaConexao();
          for (let k = 1; k <= n - i; k++) {
            const mm = addMes(m, k); const rr = (await carregarMes(mm)).slice();
            rr.filter(x => x.grupo === r.grupo).forEach(x => Object.assign(x, novo));
            setLinhas(mm, rr); marcar(mm);
          }
        } catch (e) { toast('Sem conexão: só esta parcela foi alterada.'); }
      }
    } else {
      Object.assign(r, campos, { valor: f.valor }); setLinhas(m, rows); marcar(m);
    }
  }
  fecharModal(); render(); toast('Salvo ✓'); persistir(); atualizarLembrete();
}
async function valorFixo(row, novo, m) {
  const hist = S.cfg.fixos[row.chave]; const sg = valorVigente(hist, m);
  const antes = row.valor != null ? row.valor : sg;
  if (novo !== antes || (row.valor == null && sg == null)) {
    const t = row.sub ? `${row.cat} · ${row.sub}` : row.cat;
    const r = await perguntar(sg == null ? 'Valor da conta' : 'Valor mudou', `<b>${esc(t)}</b>: ${fmt(novo)}${sg != null ? ` (antes ${fmt(sg)})` : ''}.<br>Usar este valor:`, MES_OU_PROX);
    if (!r) return false;
    if (r === 'prox') { S.cfg.fixos[row.chave] = definirDaqui(hist, m, novo); salvarCfg(); }
  }
  row.valor = novo; return true;
}
async function novaCompraParcelada(base, total, n, m) {
  try { await precisaConexao(); } catch (e) { throw new Error('Para lançar parcelado é preciso estar conectado ao Google. ' + e.message); }
  const g = uid(); const b = Math.floor(total / n), resto = total - b * n; const dia = +base.data.slice(8, 10);
  for (let i = 0; i < n; i++) {
    const mm = addMes(m, i);
    const rows = (i === 0 ? linhasDe(m) : await carregarMes(mm)).slice();
    rows.push(Object.assign({}, base, { id: uid(), data: mm + '-' + pad2(Math.min(dia, diasNoMes(mm))), valor: b + (i === 0 ? resto : 0), parcela: `${i + 1}/${n}`, grupo: g, fixa: '', chave: '' }));
    setLinhas(mm, rows); marcar(mm);
  }
}
async function excluirGasto() {
  const f = S.form; const m = f.m; let rows = linhasDe(m).slice();
  const r = rows.find(x => x.id === f.id); if (!r) return fecharModal();
  if (r.grupo) {
    const [i, n] = (r.parcela || '1/1').split('/').map(Number);
    const op = await perguntar('Excluir parcela', `Parcela ${esc(r.parcela)} de ${fmt(r.valor)}.`, [['esta', 'Só esta parcela'], ['todas', `Todas as ${n} parcelas`]]);
    if (!op) return;
    if (op === 'todas') {
      try { await precisaConexao(); } catch (e) { return toast('Sem conexão com o Google. Tente de novo.'); }
      const ini = addMes(m, -(i - 1));
      for (let k = 0; k < n; k++) {
        const mm = addMes(ini, k); if (mm === m) continue;
        const rr = (await carregarMes(mm)).filter(x => x.grupo !== r.grupo); setLinhas(mm, rr); marcar(mm);
      }
    }
    rows = rows.filter(x => x.grupo !== r.grupo || (op === 'esta' && x.id !== r.id));
  } else {
    const op = await perguntar(r.fixa === 'conta' ? 'Remover conta' : 'Excluir gasto', r.fixa === 'conta' ? 'Ela sai só deste mês. Para parar de vez, remova em Ajustes → Contas fixas.' : `${esc(nomeLinha(r))} · ${fmt(r.valor)}`, [['sim', r.fixa === 'conta' ? 'Remover deste mês' : 'Excluir']]);
    if (!op) return;
    rows = rows.filter(x => x.id !== r.id);
  }
  setLinhas(m, rows); marcar(m);
  fecharModal(); render(); toast('Excluído'); persistir(); atualizarLembrete();
}
function voltarPendente() {
  const f = S.form; const rows = linhasDe(f.m).slice(); const r = rows.find(x => x.id === f.id);
  if (r) { r.valor = null; r.forma = ''; r.cartao = ''; setLinhas(f.m, rows); marcar(f.m); }
  fecharModal(); render(); persistir(); atualizarLembrete();
}

/* =========================================================
   ENTRADAS
   ========================================================= */
function abrirEntrada(row) {
  const m = S.mes;
  S.form = row ? { id: row.id, m, desc: row.desc || '', valor: row.valor || 0, data: row.data, fixa: row.fixa === 'entrada', eraFixa: row.fixa === 'entrada', chave: row.chave }
    : { id: null, m, desc: '', valor: 0, data: dataPadrao(m), fixa: false };
  S.modal = 'entrada'; renderModal();
}
function modalEntrada() {
  const f = S.form;
  let h = cabecalho(f.id ? 'Editar entrada' : 'Nova entrada');
  h += `<label class="lb" for="edesc">Descrição</label><input class="inp" id="edesc" data-i="desc" value="${esc(f.desc)}" placeholder="Ex.: Salário">`;
  h += `<label class="lb">Valor</label>${campoValor(f.valor)}`;
  h += `<label class="lb" for="edata">Data</label><input class="inp" id="edata" type="date" data-i="data" value="${esc(f.data)}" min="${f.m}-01" max="${f.m}-${pad2(diasNoMes(f.m))}">`;
  if (!f.eraFixa) h += `<label class="check"><input type="checkbox" data-i="fixa" ${f.fixa ? 'checked' : ''}> Entrada fixa (repetir todo mês a partir de ${nomeMes(f.m)})</label>`;
  else h += `<p class="nota">Entrada fixa: ao mudar o valor, você escolhe se vale só para este mês ou daqui em diante.</p>`;
  h += `<button class="btn pri" data-a="e-salvar">Salvar</button>`;
  if (f.id) h += `<button class="btn dng" data-a="e-excluir">Excluir</button>`;
  return h;
}
async function salvarEntrada() {
  const f = S.form; const m = f.m; const c = S.cfg;
  if (!f.valor) return toast('Digite o valor');
  const desc = f.desc.trim() || 'Entrada';
  let rows = linhasDe(m).slice();
  if (!f.id) {
    const row = { id: uid(), data: f.data, tipo: 'entrada', cat: '', sub: '', desc, valor: f.valor, forma: '', cartao: '', parcela: '', grupo: '', fixa: '', chave: '' };
    if (f.fixa) {
      const e = { id: uid(), nome: desc, hist: [{ de: m, v: f.valor }], fim: null };
      c.entradasFixas.push(e); salvarCfg(); row.fixa = 'entrada'; row.chave = e.id;
      try { await aplicarDepois(m, (rr, x) => { if (!rr.some(z => z.chave === e.id)) rr.push(novaEntradaFixaRow(x, e)); }); } catch (er) {}
    }
    rows.push(row);
  } else {
    const r = rows.find(x => x.id === f.id); if (!r) return fecharModal();
    if (r.fixa === 'entrada') {
      const e = c.entradasFixas.find(x => x.id === r.chave);
      if (e && (f.valor !== r.valor || desc !== r.desc)) {
        const op = await perguntar('Entrada fixa', `<b>${esc(desc)}</b>: ${fmt(f.valor)}. Aplicar:`, MES_OU_PROX);
        if (!op) return;
        if (op === 'prox') {
          if (f.valor !== valorVigente(e.hist, m)) e.hist = definirDaqui(e.hist, m, f.valor);
          e.nome = desc; salvarCfg();
          const antigo = r.valor;
          try { await aplicarDepois(m, rr => rr.filter(z => z.chave === e.id && z.valor === antigo).forEach(z => { z.valor = f.valor; z.desc = desc; })); } catch (er) {}
        }
      }
    } else if (f.fixa) {
      const e = { id: uid(), nome: desc, hist: [{ de: m, v: f.valor }], fim: null };
      c.entradasFixas.push(e); salvarCfg(); r.fixa = 'entrada'; r.chave = e.id;
    }
    Object.assign(r, { desc, valor: f.valor, data: f.data });
  }
  setLinhas(m, rows); marcar(m);
  fecharModal(); render(); toast('Salvo ✓'); persistir();
}
async function excluirEntrada() {
  const f = S.form; const m = f.m; let rows = linhasDe(m).slice();
  const r = rows.find(x => x.id === f.id); if (!r) return fecharModal();
  if (r.fixa === 'entrada') {
    const op = await perguntar('Excluir entrada fixa', `${esc(r.desc)} · ${fmt(r.valor)}`, [['mes', 'Só deste mês'], ['parar', 'Parar a partir deste mês']]);
    if (!op) return;
    if (op === 'parar') {
      const e = S.cfg.entradasFixas.find(x => x.id === r.chave);
      if (e) { e.fim = m; salvarCfg(); try { await aplicarDepois(m, (rr) => { const i = rr.findIndex(z => z.chave === e.id); if (i >= 0) rr.splice(i, 1); }); } catch (er) {} }
    }
  } else if (!(await perguntar('Excluir entrada', `${esc(r.desc)} · ${fmt(r.valor)}`, [['sim', 'Excluir']]))) return;
  rows = rows.filter(x => x.id !== r.id); setLinhas(m, rows); marcar(m);
  fecharModal(); render(); toast('Excluído'); persistir();
}
function modalEF() {
  const f = S.form;
  let h = cabecalho('Entrada fixa');
  h += `<label class="lb" for="efn">Nome</label><input class="inp" id="efn" data-i="desc" value="${esc(f.desc)}">`;
  h += `<label class="lb">Valor a partir de ${nomeMes(f.m)}</label>${campoValor(f.valor)}`;
  h += `<button class="btn pri" data-a="ef-salvar">Salvar</button>`;
  if (!f.fim) h += `<button class="btn dng" data-a="ef-parar">Encerrar a partir de ${nomeMes(f.m)}</button>`;
  else h += `<button class="btn" data-a="ef-reativar">Reativar a partir de ${nomeMes(f.m)}</button>`;
  return h;
}
async function salvarEF(acao) {
  const f = S.form; const e = S.cfg.entradasFixas.find(x => x.id === f.id); if (!e) return fecharModal();
  const m = f.m; const desc = f.desc.trim() || e.nome;
  if (acao === 'salvar') { if (!f.valor) return toast('Digite o valor'); e.nome = desc; e.hist = definirDaqui(e.hist, m, f.valor); }
  if (acao === 'parar') e.fim = m;
  if (acao === 'reativar') { e.fim = null; if (valorVigente(e.hist, m) == null) e.hist = definirDaqui(e.hist, m, f.valor); }
  salvarCfg();
  const aplica = (rr, x) => {
    const i = rr.findIndex(z => z.chave === e.id);
    if (acao === 'parar') { if (i >= 0) rr.splice(i, 1); }
    else if (i >= 0) { rr[i].valor = valorVigente(e.hist, x); rr[i].desc = e.nome; }
    else if (entradaAtiva(e, x)) rr.push(novaEntradaFixaRow(x, e));
  };
  if (S.cfg.iniciados.includes(m) && S.meses[m]) { const rr = S.meses[m].slice(); aplica(rr, m); setLinhas(m, rr); marcar(m); }
  try { await aplicarDepois(m, aplica); } catch (er) {}
  fecharModal(); render(); toast('Salvo ✓'); persistir();
}

/* =========================================================
   CARTÕES
   ========================================================= */
function abrirCartao(id) {
  const k = id ? S.cfg.cartoes.find(x => x.id === id) : null;
  const usadas = S.cfg.cartoes.map(x => x.cor);
  S.form = k ? Object.assign({}, k, { velho: k.nome }) : { id: null, nome: '', cor: PALETA.find(p => !usadas.includes(p)) || PALETA[S.cfg.cartoes.length % PALETA.length], venc: '', fech: '' };
  S.modal = 'cartao'; renderModal();
}
function modalCartao() {
  const f = S.form;
  let h = cabecalho(f.id ? 'Editar cartão' : 'Novo cartão');
  h += `<label class="lb" for="cn">Nome do cartão</label><input class="inp" id="cn" data-i="nome" value="${esc(f.nome)}" placeholder="Ex.: Itaú">`;
  h += `<label class="lb">Cor</label><div class="swatches">${PALETA.map(p => `<button class="sw ${f.cor === p ? 'sel' : ''}" style="background:${p}" data-a="c-cor" data-v="${p}" aria-label="Cor ${p}"></button>`).join('')}<input type="color" data-i="cor" value="${esc(f.cor)}" aria-label="Outra cor"></div>`;
  h += `<label class="lb" for="cf">Dia do fechamento (opcional)</label><input class="inp" id="cf" data-i="fech" type="number" inputmode="numeric" min="1" max="31" value="${esc(f.fech)}">`;
  h += `<label class="lb" for="cv">Dia do vencimento (opcional)</label><input class="inp" id="cv" data-i="venc" type="number" inputmode="numeric" min="1" max="31" value="${esc(f.venc)}">`;
  h += `<button class="btn pri" data-a="c-salvar">Salvar</button>`;
  if (f.id) h += `<button class="btn dng" data-a="c-excluir">Excluir cartão</button>`;
  return h;
}
function renomearNasLinhas(campo, velho, novo, filtro) {
  if (!velho || velho === novo) return;
  Object.keys(S.meses).forEach(m => {
    const rows = S.meses[m]; if (!rows) return; let mud = false;
    rows.forEach(r => { if (r[campo] === velho && (!filtro || filtro(r))) { r[campo] = novo; mud = true; } });
    if (mud) { setLinhas(m, rows); marcar(m); }
  });
}
function salvarCartao() {
  const f = S.form; const nome = f.nome.trim(); if (!nome) return toast('Digite o nome');
  const dia = v => { const n = parseInt(v, 10); return n >= 1 && n <= 31 ? String(n) : ''; };
  if (S.cfg.cartoes.some(x => x.nome === nome && x.id !== f.id)) return toast('Já existe um cartão com esse nome');
  const dados = { nome, cor: f.cor, venc: dia(f.venc), fech: dia(f.fech) };
  if (f.id) { const k = S.cfg.cartoes.find(x => x.id === f.id); Object.assign(k, dados); renomearNasLinhas('cartao', f.velho, nome); }
  else S.cfg.cartoes.push(Object.assign({ id: uid() }, dados));
  salvarCfg(); fecharModal(); render(); toast('Salvo ✓'); persistir();
}
async function excluirCartao() {
  const f = S.form;
  if (!(await perguntar('Excluir cartão', `O cartão <b>${esc(f.nome)}</b> sai da lista. Os gastos já lançados continuam com o nome dele.`, [['sim', 'Excluir']]))) return;
  S.cfg.cartoes = S.cfg.cartoes.filter(x => x.id !== f.id);
  salvarCfg(); fecharModal(); render(); persistir();
}

/* =========================================================
   CATEGORIAS
   ========================================================= */
function abrirCategoria(id) {
  const k = id ? catPorId(id) : null;
  S.form = k ? { id: k.id, nome: k.nome, icone: k.icone, cor: k.cor, tipo: k.tipo, subs: k.subs.map(s => ({ id: s.id, nome: s.nome })), velho: JSON.parse(JSON.stringify(k)) }
    : { id: null, nome: '', icone: 'outros', cor: PALETA.find(p => !S.cfg.categorias.some(k => k.cor === p)) || PALETA[0], tipo: 'variavel', subs: [] };
  S.modal = 'categoria'; renderModal();
}
function modalCategoria() {
  const f = S.form;
  let h = cabecalho(f.id ? 'Editar categoria' : 'Nova categoria');
  h += `<label class="lb" for="kn">Nome</label><input class="inp" id="kn" data-i="nome" value="${esc(f.nome)}">`;
  h += `<label class="lb">Ícone</label><div class="icones">${ICONES_CAT.map(n => `<button class="icopt ${f.icone === n ? 'sel' : ''}" data-a="k-ic" data-v="${n}" aria-label="Ícone ${n}">${bolinha(n, f.cor)}</button>`).join('')}</div>`;
  h += `<label class="lb">Cor</label><div class="swatches">${PALETA.slice(0, 12).map(p => `<button class="sw ${f.cor === p ? 'sel' : ''}" style="background:${p}" data-a="k-cor" data-v="${p}" aria-label="Cor ${p}"></button>`).join('')}</div>`;
  h += `<label class="lb">Tipo</label><div class="seg"><button class="${f.tipo === 'variavel' ? 'on' : ''}" data-a="k-tipo" data-v="variavel">Variável</button><button class="${f.tipo === 'fixa' ? 'on' : ''}" data-a="k-tipo" data-v="fixa">Conta fixa</button></div>`;
  h += `<p class="nota">${f.tipo === 'fixa' ? 'Conta fixa: aparece todo mês como pendente (um item para cada subitem).' : 'Variável: você lança quando gastar.'}</p>`;
  h += `<label class="lb">Subitens ${f.tipo === 'variavel' ? '(opcional)' : ''}</label>`;
  h += f.subs.map((s, i) => `<div class="subrow"><input class="inp" data-i="sub" data-idx="${i}" value="${esc(s.nome)}" placeholder="Ex.: Luz"><button data-a="k-subdel" data-v="${i}" aria-label="Remover">✕</button></div>`).join('');
  h += `<button class="btn" data-a="k-subadd">＋ Adicionar subitem</button>`;
  h += `<button class="btn pri" data-a="k-salvar">Salvar</button>`;
  if (f.id) h += `<button class="btn dng" data-a="k-excluir">Remover categoria</button>`;
  return h;
}
function salvarCategoria() {
  const f = S.form; const c = S.cfg; const nome = f.nome.trim();
  if (!nome) return toast('Digite o nome');
  if (c.categorias.some(k => k.nome === nome && k.id !== f.id)) return toast('Já existe uma categoria com esse nome');
  const subs = f.subs.map(s => ({ id: s.id, nome: s.nome.trim() })).filter(s => s.nome);
  let k, novas = [];
  if (f.id) {
    k = catPorId(f.id); const v = f.velho;
    renomearNasLinhas('cat', v.nome, nome);
    subs.forEach(s => { const o = v.subs.find(x => x.id === s.id); if (o && o.nome !== s.nome) renomearNasLinhas('sub', o.nome, s.nome, r => r.cat === nome); });
    Object.assign(k, { nome, icone: f.icone, cor: f.cor, tipo: f.tipo, subs });
    if (k.tipo === 'fixa') novas = (subs.length ? subs : [null]).map(s => chaveDe(k, s)).filter(ch => v.tipo !== 'fixa' || !(v.subs.length ? v.subs.map(s => v.id + ':' + s.id) : [v.id]).includes(ch));
  } else {
    k = { id: uid(), nome, icone: f.icone, cor: f.cor, tipo: f.tipo, subs };
    c.categorias.push(k);
    if (k.tipo === 'fixa') novas = (subs.length ? subs : [null]).map(s => chaveDe(k, s));
  }
  salvarCfg(); ajustarPendentes(novas);
  fecharModal(); render(); toast('Salvo ✓'); persistir(); atualizarLembrete();
}
async function excluirCategoria() {
  const f = S.form;
  if (!(await perguntar('Remover categoria', `<b>${esc(f.nome)}</b> sai da lista${f.tipo === 'fixa' ? ' e deixa de aparecer nos próximos meses' : ''}. Os gastos já lançados continuam na planilha.`, [['sim', 'Remover']]))) return;
  S.cfg.categorias = S.cfg.categorias.filter(k => k.id !== f.id);
  salvarCfg(); ajustarPendentes(); fecharModal(); render(); persistir(); atualizarLembrete();
}

/* =========================================================
   LEMBRETES / NOTIFICAÇÕES
   ========================================================= */
async function atualizarLembrete() {
  const m = mesAtual(); const rows = S.meses[m]; if (!rows) return;
  const pend = rows.filter(r => r.fixa === 'conta' && r.valor == null);
  try {
    const c = await caches.open('gx-dados');
    await c.put(new URL('__lembrete', document.baseURI).href, new Response(JSON.stringify({ mes: m, n: pend.length, itens: pend.map(nomeLinha).slice(0, 6) })));
  } catch (e) {}
  if (navigator.setAppBadge) { try { pend.length ? navigator.setAppBadge(pend.length) : navigator.clearAppBadge(); } catch (e) {} }
}
async function notificarSePendente() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const pend = pendentesMesAtual(); if (!pend.length) return;
  if (ls.get('gx_notif_dia', '') === hoje()) return;
  ls.set('gx_notif_dia', hoje());
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification('Contas fixas pendentes', { body: `${pend.length} pendente(s): ${pend.slice(0, 4).map(nomeLinha).join(', ')}`, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: 'pendentes' });
  } catch (e) {}
}
async function ativarNotificacoes() {
  if (!('Notification' in window)) return toast('Este navegador não tem notificações');
  const p = await Notification.requestPermission();
  if (p === 'granted') {
    toast('Lembretes ativados 🔔');
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('periodicSync' in reg) await reg.periodicSync.register('lembrete', { minInterval: 12 * 3600 * 1000 });
    } catch (e) {}
  }
  render();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') notificarSePendente(); });

/* =========================================================
   TEMA
   ========================================================= */
function aplicarTema() {
  const t = ls.get('gx_tema', 'auto');
  if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  const escuro = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name=theme-color]').setAttribute('content', escuro ? '#0f1412' : '#f4f6f5');
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', aplicarTema);

/* =========================================================
   EVENTOS
   ========================================================= */
let histModal = false;
function fecharModal() { S.modal = null; S.form = null; renderModal(); if (histModal) { histModal = false; history.back(); } }
const ESCRITA = new Set(['f-salvar', 'f-excluir', 'f-pendente', 'e-salvar', 'e-excluir', 'ef-salvar', 'ef-parar', 'ef-reativar', 'c-salvar', 'c-excluir', 'k-salvar', 'k-excluir', 'sync', 'entrar', 'mes', 'mes-atual', 'ask']);

document.addEventListener('click', async ev => {
  const el = ev.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a, v = el.dataset.v, id = el.dataset.id;
  if (a === 'ask-fora') { if (ev.target === el) responder(null); return; }
  // abre a janela do Google ainda dentro do toque (o celular bloqueia se for depois)
  if (ESCRITA.has(a) && !S.demo && S.cid && !tokenValido() && (S.sid || a === 'entrar')) obterToken().catch(() => {});
  const f = S.form;
  try {
    switch (a) {
      case 'tab': S.tab = v; render(); window.scrollTo(0, 0); break;
      case 'mes': {
        const alvo = addMes(S.mes, +v); const nm = MESES[+alvo.slice(5, 7) - 1];
        if (S.mes === mesAtual() && alvo !== mesAtual()) {
          const ok = await perguntar(`Ir para ${nomeMes(alvo)}?`, `Você vai sair do mês atual. O que lançar lá conta para <b>${nm.toLowerCase()}</b>, não para ${MESES[+S.mes.slice(5, 7) - 1].toLowerCase()}.`, [['ir', `Sim, ir para ${nm.toLowerCase()}`]]);
          if (!ok) break;
        }
        await abrirMes(alvo); window.scrollTo(0, 0); break;
      }
      case 'mes-atual': await abrirMes(mesAtual()); window.scrollTo(0, 0); break;
      case 'k-ic': f.icone = v; renderModal(); break;
      case 'k-cor': f.cor = v; renderModal(); break;
      case 'sync': await sincronizarTudo(); break;
      case 'novo-gasto': abrirGasto(null); break;
      case 'ir-fixas': { const e = document.getElementById('fixas'); e && window.scrollTo({ top: e.offsetTop - 70, behavior: 'smooth' }); break; }
      case 'nova-entrada': abrirEntrada(null); break;
      case 'editar': { const r = linhasDe(S.mes).find(x => x.id === id); if (!r) break; r.tipo === 'entrada' ? abrirEntrada(r) : abrirGasto(r); break; }
      case 'fechar': fecharModal(); break;
      case 'ask': responder(v); break;
      case 'f-cat': { f.catId = id; const k = catPorId(id); f.subId = ''; if (k && k.subs.length === 1) f.subId = k.subs[0].id; renderModal(); break; }
      case 'f-sub': f.subId = f.subId === id ? '' : id; renderModal(); break;
      case 'f-forma': f.forma = v; if (v === 'Crédito' && !f.cartaoId && S.cfg.cartoes.length === 1) f.cartaoId = S.cfg.cartoes[0].id; renderModal(); break;
      case 'f-cartao': f.cartaoId = id; renderModal(); break;
      case 'f-modo': f.modo = v; renderModal(); break;
      case 'f-n': f.n = Math.max(2, Math.min(48, f.n + +v)); renderModal(); break;
      case 'f-salvar': await salvarGasto(); break;
      case 'f-excluir': await excluirGasto(); break;
      case 'f-pendente': voltarPendente(); break;
      case 'e-salvar': await salvarEntrada(); break;
      case 'e-excluir': await excluirEntrada(); break;
      case 'ef': { const e = S.cfg.entradasFixas.find(x => x.id === id); const m = mesAtual(); S.form = { id, m, desc: e.nome, valor: valorVigente(e.hist, m) ?? e.hist[e.hist.length - 1].v, fim: e.fim && e.fim <= m ? e.fim : null }; S.modal = 'ef'; renderModal(); break; }
      case 'ef-salvar': await salvarEF('salvar'); break;
      case 'ef-parar': await salvarEF('parar'); break;
      case 'ef-reativar': await salvarEF('reativar'); break;
      case 'cartao': abrirCartao(id); break;
      case 'c-cor': f.cor = v; renderModal(); break;
      case 'c-salvar': salvarCartao(); break;
      case 'c-excluir': await excluirCartao(); break;
      case 'categoria': abrirCategoria(id); break;
      case 'k-tipo': f.tipo = v; renderModal(); break;
      case 'k-subadd': f.subs.push({ id: uid(), nome: '' }); renderModal(); { const ins = document.querySelectorAll('[data-i=sub]'); ins.length && ins[ins.length - 1].focus(); } break;
      case 'k-subdel': f.subs.splice(+v, 1); renderModal(); break;
      case 'k-salvar': salvarCategoria(); break;
      case 'k-excluir': await excluirCategoria(); break;
      case 'tema': ls.set('gx_tema', v); aplicarTema(); render(); break;
      case 'notif': await ativarNotificacoes(); break;
      case 'salvar-cid': salvarCid(); break;
      case 'entrar': await entrar(); break;
      case 'trocar-cid': trocarCid(); break;
      case 'demo': entrarDemo(); break;
      case 'sair-demo': await sairDemo(); break;
      case 'sair': await sair(); break;
    }
  } catch (e) { console.error(e); toast(e.message || 'Algo deu errado'); }
});

// máscara de dinheiro: os dígitos entram pela direita (1 → 0,01; 1 e 0 → 0,10)
function mostrarValor(el, c) {
  el.value = fmtN(c); if (S.form) S.form.valor = c;
  try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {}
  const p = document.getElementById('prev-parc'); if (p && S.form) p.textContent = previaParcelas(S.form);
}
document.addEventListener('beforeinput', ev => {
  const el = ev.target; if (el.dataset.i !== 'valor' || !S.form) return;
  const c = S.form.valor || 0; const t = ev.inputType;
  if (t === 'insertText' && ev.data && /^\d+$/.test(ev.data)) {
    ev.preventDefault(); const n = String(S.form._novo ? 0 : c) + ev.data; S.form._novo = false;
    mostrarValor(el, Math.min(parseInt(n, 10), 99999999999));
  } else if (t === 'deleteContentBackward') {
    ev.preventDefault(); const z = S.form._novo; S.form._novo = false; mostrarValor(el, z ? 0 : Math.floor(c / 10));
  } else if (t === 'insertText') ev.preventDefault();
});
document.addEventListener('input', ev => {
  const el = ev.target; const k = el.dataset.i; if (!k) return;
  const f = S.form;
  if (k === 'valor') {
    const d = el.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11);
    const c = d ? parseInt(d, 10) : 0;
    el.value = fmtN(c); if (f) f.valor = c;
    try { el.setSelectionRange(el.value.length, el.value.length); } catch (e) {}
    const p = document.getElementById('prev-parc'); if (p && f) p.textContent = previaParcelas(f);
    return;
  }
  if (k === 'cid') { S.cidTmp = el.value; return; }
  if (!f) return;
  if (k === 'sub') { f.subs[+el.dataset.idx].nome = el.value; return; }
  if (k === 'fixa') { f.fixa = el.checked; return; }
  f[k] = el.value;
});
document.addEventListener('change', ev => { if (ev.target.dataset.i === 'fixa' && S.form) S.form.fixa = ev.target.checked; });
document.addEventListener('focusin', ev => {
  const el = ev.target; if (el.dataset && el.dataset.i === 'valor' && S.form) S.form._novo = !!S.form.valor;
  if (el.dataset && el.dataset.i === 'valor') setTimeout(() => { try { el.setSelectionRange(S.form && S.form._novo ? 0 : el.value.length, el.value.length); } catch (e) {} }, 0);
});
window.addEventListener('popstate', () => {
  if (!histModal) return;
  histModal = false;
  if (S.ask) responder(null);
  if (S.modal) { S.modal = null; S.form = null; renderModal(); }
});

/* =========================================================
   CONTA / INÍCIO
   ========================================================= */
function salvarCid() {
  const v = (S.cidTmp || '').trim();
  if (!/\.apps\.googleusercontent\.com$/.test(v)) return toast('O código deve terminar em .apps.googleusercontent.com');
  S.cid = v; ls.set('gx_cid', v); tokenClient = null; render();
}
function trocarCid() {
  S.cid = ''; ls.del('gx_cid'); tokenClient = null; S.token = null; ls.del('gx_tok');
  render();
}
async function entrar() {
  try {
    await obterToken(); toast('Conectando à planilha…');
    await conectarPlanilha();
    S.tab = 'lancar'; await abrirMes(mesAtual()); toast('Conectado ✓');
  } catch (e) { toast(e.message); render(); }
}
async function sincronizarTudo() {
  if (S.demo) return toast('Modo de teste: os dados ficam neste aparelho.');
  try {
    await obterToken();
    S.syncing = true; renderTopo();
    if (!S.conectado) await conectarPlanilha(); else if (!S.dirty.has('_cfg')) await puxarCfg();
    S.syncing = false;
    await persistir();
    await abrirMes(S.mes);
    if (!S.erroSync) toast('Sincronizado ✓');
  } catch (e) { S.syncing = false; S.erroSync = e.message; renderTopo(); toast(e.message); }
}
function limparDados() {
  Object.keys(localStorage).filter(k => k.startsWith('gx_') && !['gx_tema', 'gx_cid'].includes(k)).forEach(k => localStorage.removeItem(k));
  S.meses = {}; S.dirty = new Set(); S.cfg = null; S.sid = null; S.token = null; S.conectado = false; S.abas = {};
}
function entrarDemo() {
  S.demo = true; ls.set('gx_demo', true); S.cfg = cfgPadrao(); ls.set('gx_cfg', S.cfg);
  abrirMes(mesAtual());
}
async function sairDemo() {
  if (!(await perguntar('Sair do modo de teste', 'Os dados de teste deste aparelho serão apagados.', [['sim', 'Apagar e conectar ao Google']]))) return;
  limparDados(); S.demo = false; ls.del('gx_demo'); render();
}
async function sair() {
  if (!(await perguntar('Sair da conta', 'Seus dados continuam na planilha. Para voltar, é só entrar de novo.', [['sim', 'Sair']]))) return;
  try { if (S.token && gisPronto()) google.accounts.oauth2.revoke(S.token, () => {}); } catch (e) {}
  ls.del('gx_consent'); limparDados(); render();
}

// dados de exemplo usados só na prévia
function exemplos() {
  const m = mesAtual(); const d = n => m + '-' + pad2(Math.min(n, +hoje().slice(8, 10)));
  const k = n => S.cfg.categorias.find(x => x.nome === n);
  const casa = k('Contas da casa'); const alug = casa.subs.find(s => s.nome === 'Aluguel'); const luz = casa.subs.find(s => s.nome === 'Luz');
  S.cfg.fixos[chaveDe(casa, alug)] = [{ de: m, v: 60000 }];
  const sal = { id: uid(), nome: 'Salário (exemplo)', hist: [{ de: m, v: 520000 }], fim: null };
  S.cfg.entradasFixas.push(sal);
  iniciarMes(m);
  const rows = linhasDe(m).slice();
  rows.forEach(r => { if (r.chave === chaveDe(casa, alug)) Object.assign(r, { valor: 60000, forma: 'Pix', data: d(5) }); if (r.chave === chaveDe(casa, luz)) Object.assign(r, { valor: 18790, forma: 'Débito', data: d(10) }); });
  const g = uid();
  rows.push(
    { id: uid(), data: d(3), tipo: 'saida', cat: 'Mercado/Feira', sub: '', desc: 'Exemplo', valor: 32450, forma: 'Crédito', cartao: 'Nubank', parcela: '', grupo: '', fixa: '', chave: '' },
    { id: uid(), data: d(8), tipo: 'saida', cat: 'Combustível', sub: '', desc: 'Exemplo', valor: 20000, forma: 'Pix', cartao: '', parcela: '', grupo: '', fixa: '', chave: '' },
    { id: uid(), data: d(12), tipo: 'saida', cat: 'Saúde/Farmácia', sub: '', desc: 'Exemplo', valor: 8790, forma: 'Dinheiro', cartao: '', parcela: '', grupo: '', fixa: '', chave: '' },
    { id: uid(), data: d(15), tipo: 'saida', cat: 'Compras', sub: '', desc: 'Exemplo parcelado', valor: 15000, forma: 'Crédito', cartao: 'Amazon', parcela: '1/4', grupo: g, fixa: '', chave: '' });
  setLinhas(m, rows);
  for (let i = 1; i < 4; i++) { const mm = addMes(m, i); setLinhas(mm, [{ id: uid(), data: mm + '-15', tipo: 'saida', cat: 'Compras', sub: '', desc: 'Exemplo parcelado', valor: 15000, forma: 'Crédito', cartao: 'Amazon', parcela: (i + 1) + '/4', grupo: g, fixa: '', chave: '' }]); }
  ls.set('gx_cfg', S.cfg);
}
async function iniciar() {
  aplicarTema();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  const c = ls.get('gx_cfg', null); S.cfg = c ? normalizarCfg(c) : null;
  if (S.cfg && S.cfg._mig) { delete S.cfg._mig; salvarCfg(); }
  if (S.demo) { if (!S.cfg) { S.cfg = cfgPadrao(); ls.set('gx_cfg', S.cfg); if (window.GX_PREVIEW) exemplos(); } await abrirMes(S.mes); return; }
  if (!S.cid || !S.sid || !S.cfg) { render(); return; }
  await abrirMes(S.mes);
}
iniciar();
