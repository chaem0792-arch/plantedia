// 🧭 나무 상세 페이지에 "검색표에서 찾아가는 길" 메뉴를 붙여요.
// 상세 페이지 맨 아래에 아래 두 줄만 넣으면 돼요 (plant-key.js 다음에 이 파일).
//   <script src="../js/plant-key.js"></script>
//   <script src="../js/key-path-menu.js"></script>
(function () {
    const fileName = decodeURIComponent(location.pathname.split('/').pop() || '');
    const pageName = fileName.replace(/\.html?$/i, '');

    const style = document.createElement('style');
    style.textContent = `
    .key-path-wrap { width: 90%; max-width: 1000px; margin: 0 auto 50px; font-family: "Noto Sans KR", sans-serif; }
    .key-path { background: #ffffff; border: 2px solid #c8e6c9; border-radius: 18px; overflow: hidden; }
    .key-path > summary { cursor: pointer; list-style: none; padding: 18px 24px; font-family: "Jua", sans-serif;
        font-size: 21px; color: #2e7d32; display: flex; justify-content: space-between; align-items: center; }
    .key-path > summary::-webkit-details-marker { display: none; }
    .key-path > summary::after { content: "펼치기 ▾"; font-family: "Noto Sans KR", sans-serif; font-size: 14px; color: #6b8f71; }
    .key-path[open] > summary::after { content: "접기 ▴"; }
    .key-path[open] > summary { border-bottom: 1px dashed #c8e6c9; }
    .key-path-body { padding: 16px 24px 22px; }
    .key-path-label { font-size: 14px; color: #6b8f71; margin: 0 0 10px; }
    .key-path-steps { margin: 0 0 6px; padding: 0; list-style: none; counter-reset: kp; }
    .key-path-steps li { display: flex; gap: 12px; align-items: flex-start; padding: 9px 0; font-size: 16px;
        line-height: 1.5; color: #3d4a40; border-top: 1px solid #eef3ee; }
    .key-path-steps li:first-child { border-top: none; }
    .kp-step { flex: none; background: #e8f5e9; color: #2e7d32; font-weight: 700; font-size: 13px;
        padding: 3px 10px; border-radius: 12px; margin-top: 1px; }
    .kp-choice { font-weight: 700; color: #2e7d32; margin-right: 4px; }
    .kp-result { margin-top: 10px; font-size: 16px; color: #355443; }
    .kp-result b { font-family: "Jua", sans-serif; font-size: 20px; color: #2e7d32; }
    .kp-empty { font-size: 15px; color: #666; line-height: 1.6; margin: 0; }
    .kp-links { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
    .kp-links a { text-decoration: none; font-size: 14px; font-weight: 700; padding: 8px 14px; border-radius: 10px;
        border: 2px solid #2e7d32; color: #2e7d32; background: #fff; }
    .kp-links a:hover { background: #2e7d32; color: #fff; }
    @media (max-width: 700px) { .key-path-wrap { width: 92%; margin-bottom: 25px; } .key-path-steps li { font-size: 15px; } }
    `;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'key-path-wrap';
    const details = document.createElement('details');
    details.className = 'key-path';
    const summary = document.createElement('summary');
    summary.textContent = '🧭 검색표에서 이 나무를 찾아가는 길';
    const body = document.createElement('div');
    body.className = 'key-path-body';
    details.append(summary, body);
    wrap.appendChild(details);

    const hasData = typeof keyData !== 'undefined' && typeof findKeyPath === 'function';
    const results = hasData ? keyResultsForPage(pageName) : [];
    const paths = results.map(r => ({ result: r, path: findKeyPath(r) })).filter(p => p.path);

    if (paths.length === 0) {
        const p = document.createElement('p');
        p.className = 'kp-empty';
        p.textContent = `${pageName}은(는) 아직 이분검색표에 들어 있지 않아요. 검색표에 추가되면 여기에 찾아가는 길이 나타나요.`;
        body.appendChild(p);
    } else {
        paths.forEach(({ result, path }) => {
            const label = document.createElement('p');
            label.className = 'key-path-label';
            label.textContent = `검색표 게임에서 아래 순서대로 고르면 돼요. (모두 ${path.length}번 선택)`;
            const ol = document.createElement('ol');
            ol.className = 'key-path-steps';
            path.forEach(({ step, choice, text }) => {
                const li = document.createElement('li');
                const badge = document.createElement('span');
                badge.className = 'kp-step';
                badge.textContent = `단계 ${step}`;
                const answer = document.createElement('span');
                const c = document.createElement('span');
                c.className = 'kp-choice';
                c.textContent = choice.toUpperCase() + '.';
                answer.append(c, document.createTextNode(text));
                li.append(badge, answer);
                ol.appendChild(li);
            });
            const res = document.createElement('div');
            res.className = 'kp-result';
            res.append('➔ 결과: ');
            const b = document.createElement('b');
            b.textContent = result;
            res.appendChild(b);
            body.append(label, ol, res);
        });
    }

    const links = document.createElement('div');
    links.className = 'kp-links';
    links.innerHTML = '<a href="../question.html">🌿 검색표 게임 해 보기</a><a href="../gallery.html">📖 도감으로</a><a href="../index.html">🏠 홈으로</a>';
    body.appendChild(links);

    // 스크립트가 들어 있는 자리(페이지 맨 아래)에 메뉴를 붙여요.
    const main = document.querySelector('main, .tree-card');
    if (main && main.parentNode) main.after(wrap);
    else document.body.appendChild(wrap);

    // 가로로 늘어놓는(flex) 페이지에서도 메뉴가 맨 아래 한 줄을 다 쓰게 해요.
    const parent = wrap.parentElement;
    const ps = getComputedStyle(parent);
    if (ps.display.includes('flex') && !ps.flexDirection.startsWith('column')) {
        parent.style.flexWrap = 'wrap';
        wrap.style.flex = '0 0 100%';
        wrap.style.maxWidth = '1000px';
        wrap.style.marginTop = '24px';
    }
})();
