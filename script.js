
  // ── Image Upload ──
 const dropZone = document.getElementById('dropZone');

if (dropZone) {
  const fileInput = document.getElementById('fileInput');
  const previewArea = document.getElementById('previewArea');
  const previewImg = document.getElementById('previewImg');
  const analyzeBtn = document.getElementById('analyzeBtn');

  dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragging'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  });

  fileInput.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  function handleFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewArea.style.display = 'block';
      dropZone.style.display = 'none';
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    previewArea.style.display = 'none';
    dropZone.style.display = 'block';
    fileInput.value = '';
    analyzeBtn.disabled = true;
    document.getElementById('resultsPlaceholder').style.display = 'flex';
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('resultContent').style.display = 'none';
  }

  // ── Mock Disease Database ──
  const diseaseDB = {
    'Tomato Late Blight': {
      emoji: '🍅',
      severity: 'high',
      confidence: 94,
      description: 'Late blight (Phytophthora infestans) is a water mold causing rapid tissue death in tomatoes. It spreads quickly in cool, wet conditions and can devastate entire fields within days.',
      chemical: [
        { title: 'Apply copper-based fungicide', detail: 'Use Bordeaux mixture or copper hydroxide at 2–3 g/L. Apply every 7–10 days during humid periods.' },
        { title: 'Mancozeb treatment', detail: 'Apply at 2.5 g/L water. Effective as a protective spray before infection or at early sign of disease.' },
        { title: 'Remove infected plant material', detail: 'Destroy (do not compost) all severely affected leaves and stems immediately to reduce spore load.' }
      ],
      organic: [
        { title: 'Neem oil spray', detail: 'Mix 5 ml neem oil + 2 ml liquid soap per liter of water. Spray early morning or evening, every 5–7 days.' },
        { title: 'Baking soda solution', detail: '1 tsp baking soda + 1 tsp vegetable oil + 1 liter water. Changes leaf pH, inhibiting spore germination.' },
        { title: 'Improve air circulation', detail: 'Prune lower leaves and stake plants to improve airflow — this reduces humidity around foliage.' }
      ],
      prevention: [
        { title: 'Avoid overhead irrigation', detail: 'Wet foliage promotes spore germination. Use drip irrigation directed at the soil, not leaves.' },
        { title: 'Use resistant varieties', detail: 'Plant blight-resistant tomato varieties like Mountain Magic, Defiant PhR, or Juliet where available.' },
        { title: 'Crop rotation', detail: 'Do not plant tomatoes or potatoes in the same location for at least 3 years.' }
      ],
      alternatives: [
        { name: 'Tomato Early Blight', pct: 3 },
        { name: 'Tomato Leaf Mold', pct: 2 },
        { name: 'Healthy', pct: 1 }
      ]
    },
    'Corn Gray Leaf Spot': {
      emoji: '🌽',
      severity: 'medium',
      confidence: 88,
      description: 'Gray leaf spot (Cercospora zeae-maydis) is a fungal disease causing rectangular lesions on corn leaves, limiting photosynthesis and reducing yield by up to 30% in severe cases.',
      chemical: [
        { title: 'Strobilurin fungicides', detail: 'Apply azoxystrobin or pyraclostrobin at early silking stage for best protection of ear leaves.' },
        { title: 'Triazole application', detail: 'Propiconazole at label rates effectively controls GLS. Combine with strobilurins for broader spectrum.' }
      ],
      organic: [
        { title: 'Bacillus subtilis biocontrol', detail: 'Apply Serenade (B. subtilis QST 713) as a preventative spray to suppress fungal growth naturally.' },
        { title: 'Remove crop debris', detail: 'Till under or remove infected corn residue after harvest — the fungus overwinters in debris.' }
      ],
      prevention: [
        { title: 'Use tolerant hybrids', detail: 'Select corn hybrids rated tolerant or resistant to GLS for fields with disease history.' },
        { title: 'Improve field drainage', detail: 'GLS thrives in humid, poorly drained fields. Address drainage issues between seasons.' },
        { title: 'Adequate plant spacing', detail: 'Reduce planting density slightly in high-risk areas to improve canopy air circulation.' }
      ],
      alternatives: [
        { name: 'Northern Leaf Blight', pct: 7 },
        { name: 'Common Rust', pct: 4 },
        { name: 'Healthy', pct: 1 }
      ]
    },
    'Apple Scab': {
      emoji: '🍎',
      severity: 'medium',
      confidence: 91,
      description: 'Apple scab (Venturia inaequalis) causes dark, scabby lesions on leaves and fruit surfaces. While rarely fatal, severe infections reduce marketable yield significantly.',
      chemical: [
        { title: 'Captan fungicide', detail: 'Apply at pink stage and repeat every 7–10 days through petal fall. Highly effective protectant.' },
        { title: 'Myclobutanil (Rally)', detail: 'Systemic fungicide effective as both protectant and eradicant. Follow label for resistance management.' }
      ],
      organic: [
        { title: 'Lime sulfur spray', detail: 'Apply during dormancy and at green tip. Controls overwintering spores on bark and bud scales.' },
        { title: 'Sulfur-based sprays', detail: 'Wettable sulfur every 7 days from tight cluster through cover provides reasonable organic control.' }
      ],
      prevention: [
        { title: 'Rake and destroy fallen leaves', detail: 'The fungus overwinters in fallen infected leaves. Remove or shred them to destroy inoculum.' },
        { title: 'Plant resistant varieties', detail: 'Liberty, Enterprise, and GoldRush are scab-resistant varieties that eliminate spray programs.' },
        { title: 'Prune for airflow', detail: 'Open canopy pruning reduces leaf wetness duration — the key driver of infection periods.' }
      ],
      alternatives: [
        { name: 'Apple Black Rot', pct: 6 },
        { name: 'Cedar Apple Rust', pct: 2 },
        { name: 'Healthy', pct: 1 }
      ]
    }
  };

  const diseaseKeys = Object.keys(diseaseDB);

  // ── Simulate Analysis ──
  function runAnalysis() {
    document.getElementById('resultsPlaceholder').style.display = 'none';
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('resultContent').style.display = 'none';
    analyzeBtn.disabled = true;

    setTimeout(() => {
      const key = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
      showResult(key);
      analyzeBtn.disabled = false;
    }, 2800);
  }

  function showResult(key) {
    const d = diseaseDB[key];
    document.getElementById('loadingState').style.display = 'none';

    const severityLabel = d.severity === 'high' ? 'High Severity' : d.severity === 'medium' ? 'Moderate Severity' : 'Low Severity';
    const badgeClass = d.severity === 'high' ? 'badge-red' : d.severity === 'medium' ? 'badge-amber' : 'badge-green';
    const confWidth = d.confidence;

    const buildTreatmentItems = (arr) => arr.map((item, i) => `
      <div class="treatment-item">
        <div class="treatment-num">${i+1}</div>
        <p><strong>${item.title}.</strong> ${item.detail}</p>
      </div>
    `).join('');

    const altItems = d.alternatives.map(a => `
      <div class="prediction-item">
        <span class="prediction-label">${a.name}</span>
        <div class="prediction-bar-wrap"><div class="prediction-bar" style="width:${a.pct}%"></div></div>
        <span class="prediction-pct">${a.pct}%</span>
      </div>
    `).join('');

    const html = `
      <div class="disease-header severity-${d.severity}">
        <div class="disease-icon">${d.emoji}</div>
        <div class="disease-title">
          <h3>${key}</h3>
          <span class="severity-badge ${badgeClass}">${severityLabel}</span>
        </div>
      </div>

      <div class="confidence-section">
        <label>Model confidence <span>${confWidth}%</span></label>
        <div class="confidence-bar">
          <div class="confidence-fill" id="confFill" style="width:0%"></div>
        </div>
      </div>

      <p style="font-size:13px;color:var(--ink2);line-height:1.65;font-weight:300">${d.description}</p>

      <div>
        <p style="font-size:12px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">Other Possibilities</p>
        <div class="predictions-list">
          <div class="prediction-item">
            <span class="prediction-label" style="color:var(--ink);font-weight:500">${key}</span>
            <div class="prediction-bar-wrap"><div class="prediction-bar top" style="width:${confWidth}%"></div></div>
            <span class="prediction-pct" style="color:var(--leaf)">${confWidth}%</span>
          </div>
          ${altItems}
        </div>
      </div>

      <div>
        <div class="treatment-tabs">
          <button class="tab-btn active" onclick="switchTab('chemical',this)">Chemical</button>
          <button class="tab-btn" onclick="switchTab('organic',this)">Organic</button>
          <button class="tab-btn" onclick="switchTab('prevention',this)">Prevention</button>
        </div>
        <div class="tab-panel active" id="tab-chemical">${buildTreatmentItems(d.chemical)}</div>
        <div class="tab-panel" id="tab-organic">${buildTreatmentItems(d.organic)}</div>
        <div class="tab-panel" id="tab-prevention">${buildTreatmentItems(d.prevention)}</div>
      </div>

      <div class="result-actions">
        <button class="action-btn action-btn-primary" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Export Report
        </button>
        <button class="action-btn action-btn-outline" onclick="clearImage()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
          New Diagnosis
        </button>
      </div>
    `;

    const rc = document.getElementById('resultContent');
    rc.innerHTML = html;
    rc.style.display = 'flex';
    rc.style.flexDirection = 'column';
    rc.style.gap = '24px';

    setTimeout(() => {
      const fill = document.getElementById('confFill');
      if (fill) fill.style.width = confWidth + '%';
    }, 100);
  }

  function switchTab(name, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + name).classList.add('active');
  }
}