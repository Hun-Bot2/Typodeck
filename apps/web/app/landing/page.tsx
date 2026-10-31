import type { Metadata } from 'next';
import styles from './landing.module.css';
import { DEMO_DECKS, EVIDENCE_EXAMPLE, GITHUB_URL, SYSTEMS } from './data';
import DemoConsole from './demo';

export const metadata: Metadata = {
  title: 'Typodeck — Turn a GitHub repo into an editable pitch deck',
  description:
    'Paste a public repo URL. Typodeck extracts evidenced claims, lays them out in four typography-only systems, and exports an editable .pptx with provenance on every slide.',
};

export default function LandingPage() {
  const primary = DEMO_DECKS[0];
  return (
    <div className={styles.page}>
      <nav className={styles.mast} aria-label="Landing">
        <p className={styles.mastLabel}>on this page ↓</p>
        <div className={styles.mastNav}>
          <a href="#demo">Live demo</a>
          <a href="#evidence">Evidence → slides</a>
          <a href="#decks">Example decks</a>
          <a href="#limits">Limitations</a>
          <a href="/">Open Studio</a>
          <a href={GITHUB_URL}>GitHub</a>
        </div>
      </nav>

      <header className={`${styles.bleed} ${styles.hero}`} id="demo">
        <div className={`${styles.bleedInner} ${styles.heroGrid}`}>
          <div>
            <p className={styles.kicker}>
              <strong>Typodeck</strong> · repo → deck · typography only
            </p>
            <h1 className={styles.headline}>Paste a repo. Present it next week.</h1>
            <p className={styles.lede}>
              Typodeck reads a public GitHub repository, pulls out{' '}
              <strong>claims with file-and-line refs</strong>, lays them out in four
              typography-only design systems, and hands you an{' '}
              <strong>editable .pptx</strong> — every slide captioned with its source. No
              shapes, no stock, no clip art.
            </p>
          </div>
          <DemoConsole />
        </div>
        <ul className={`${styles.bleedInner} ${styles.heroNotes}`}>
          <li>→ the console is live: it calls /api/generate on this server</li>
          <li>→ try <a href="https://github.com/sindresorhus/is">sindresorhus/is</a> — small, fast, public</li>
          <li>→ full control (idea mode, viewer) lives in the <a href="/">Studio</a></li>
        </ul>
      </header>

      <section className={styles.section} aria-labelledby="evidence-title" id="evidence">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>01</span>
          <h2 className={styles.sectionTitle} id="evidence-title">
            From repo evidence to slides
          </h2>
        </div>
        <p className={styles.sectionLede}>
          The pipeline is <code>ingest → evidence → narrative → layout → export → validate</code>.
          These are the observed numbers from a real run — <code>{primary.repo}</code> at{' '}
          <code>{primary.sha}</code> — not illustrations.
        </p>
        <div className={styles.steps}>
          <div className={styles.step}>
            <p className={styles.stepNum}>ingest</p>
            <p className={styles.stepName}>Read the repo</p>
            <p className={styles.stepBody}>
              <strong>{primary.files} files · {primary.bytes.toLocaleString()} bytes.</strong>{' '}
              {primary.filesNote} Bounded at ≤20 files / ≤200&nbsp;KB, disclosed when the cap
              hits.
            </p>
          </div>
          <div className={styles.step}>
            <p className={styles.stepNum}>evidence</p>
            <p className={styles.stepName}>Extract claims</p>
            <p className={styles.stepBody}>
              <strong>
                {primary.claims.total} claims — {primary.claims.verified} verified,{' '}
                {primary.claims.suggestion} suggestion.
              </strong>{' '}
              Code terms confirm docs; numbers are copied verbatim, never computed.
            </p>
          </div>
          <div className={styles.step}>
            <p className={styles.stepNum}>narrative</p>
            <p className={styles.stepName}>Shape the story</p>
            <p className={styles.stepBody}>
              <strong>{primary.slides} slides from the strongest claims.</strong> Each claim
              slide carries a caption with its <code>source:lines</code> ref and an honesty
              tag when it is unverified.
            </p>
          </div>
          <div className={styles.step}>
            <p className={styles.stepNum}>layout · export · validate</p>
            <p className={styles.stepName}>Set type, ship .pptx</p>
            <p className={styles.stepBody}>
              <strong>
                {primary.system} grid · seed {primary.seed} · {primary.boxes} text boxes.
              </strong>{' '}
              Validator OK: 16:9, everything in bounds, {primary.editableChars.toLocaleString()}{' '}
              editable characters.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <p className={styles.exampleTitle}>one real claim, end to end (is-swiss deck JSON, slide 5)</p>
          <ul className={styles.exampleFlow}>
            <li>
              <span className={styles.exKey}>claim</span>
              <span>“{EVIDENCE_EXAMPLE.claim}”</span>
            </li>
            <li>
              <span className={styles.exKey}>caption</span>
              <span>
                <code>{EVIDENCE_EXAMPLE.caption}</code> — no unverified tag: code-confirmed
              </span>
            </li>
            <li>
              <span className={styles.exKey}>slide</span>
              <span>{EVIDENCE_EXAMPLE.slide}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="decks-title" id="decks">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>02</span>
          <h2 className={styles.sectionTitle} id="decks-title">
            Three repos, three decks, zero mockups
          </h2>
        </div>
        <p className={styles.sectionLede}>
          Each deck below was generated by the real pipeline (<code>planDeck → exportToPptx → validatePptx</code>)
          from the pinned commit shown. Scroll the filmstrip to walk all 12 slides.
        </p>
        {DEMO_DECKS.map((deck) => (
          <article className={styles.deck} key={deck.slug} aria-label={`${deck.repo} deck`}>
            <div className={styles.deckHead}>
              <p className={styles.deckRepo}>
                <a href={deck.repoUrl}>{deck.repo}</a> @ {deck.sha} · {deck.branch} · purpose “{deck.purpose}”
              </p>
              <h3 className={styles.deckName}>
                {deck.system.charAt(0).toUpperCase() + deck.system.slice(1)} · {deck.slides} slides
              </h3>
              <p className={styles.deckStats}>
                <span>seed {deck.seed}</span>
                <span>{deck.files} files / {(deck.bytes / 1024).toFixed(1)} KB</span>
                <span>
                  claims {deck.claims.total} ({deck.claims.verified}v/{deck.claims.suggestion}s/
                  {deck.claims.ungrounded}u)
                </span>
                <span>{deck.boxes} text boxes</span>
                <span>{deck.editableChars.toLocaleString()} editable chars</span>
                <span>validator OK</span>
              </p>
            </div>
            <div className={styles.stripWrap}>
              <div className={styles.stripScroll} tabIndex={0} aria-label={`All ${deck.slides} slides of the ${deck.repo} deck (scrollable)`}>
                <img
                  src={deck.filmstrip}
                  alt={`All ${deck.slides} slides of the ${deck.repo} ${deck.system} deck`}
                  loading="lazy"
                />
              </div>
              <p className={styles.stripCap}>all {deck.slides} slides · scroll ↓</p>
            </div>
          </article>
        ))}
        <p className={styles.methodNote}>
          How these previews were made: static HTML rendered from the actual deck JSON with the
          exact slide-geometry mapping, rasterized in headless Chrome. They are geometry previews,
          not direct .pptx rasterizations — PPTX correctness rests on the repo validator plus an
          independent check that every deck-JSON block is present in its slide&apos;s text runs
          (46 text nodes per deck, zero non-text elements).
        </p>
      </section>

      <section className={styles.section} aria-labelledby="systems-title" id="systems">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>03</span>
          <h2 className={styles.sectionTitle} id="systems-title">
            Four type systems, one narrative
          </h2>
        </div>
        <p className={styles.sectionLede}>
          Every run lays out all four systems from the same narrative, so the previews are
          directly comparable. Pick one to export.
        </p>
        <div className={styles.sysGrid}>
          {SYSTEMS.map((sys) => (
            <div className={styles.sys} key={sys.id}>
              <h3 className={styles.sysName}>
                {sys.id.charAt(0).toUpperCase() + sys.id.slice(1)}
                <span className={styles.tag}>
                  {sys.id === 'swiss'
                    ? '· is deck'
                    : sys.id === 'editorial'
                      ? '· dayjs deck'
                      : sys.id === 'expressive'
                        ? '· handbook deck'
                        : '· experimental'}
                </span>
              </h3>
              <p>{sys.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="facts-title" id="facts">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>04</span>
          <h2 className={styles.sectionTitle} id="facts-title">
            Editable output, traceable words
          </h2>
        </div>
        <div className={styles.factGrid}>
          <div className={styles.factBlock}>
            <h3>The .pptx is really editable</h3>
            <ul className={styles.factList}>
              <li>
                Text ships as native text runs — the demo decks carry 1,332–1,987 editable
                characters each. Nothing is rasterized.
              </li>
              <li>
                Every export is re-validated before download: 16:9 slide size, all text boxes in
                bounds, an editable-character floor, no images or shapes allowed.
              </li>
              <li>
                Layout is recomputed on the server at export time — the file you download is
                generated from the narrative, not pasted from a preview.
              </li>
            </ul>
          </div>
          <div className={styles.factBlock}>
            <h3>Every claim shows its provenance</h3>
            <ul className={styles.factList}>
              <li>
                <code>verified</code> — from repo code, or docs confirmed by a distinctive code
                term. <code>suggestion</code> — from README/docs, captioned{' '}
                <code>unverified</code>. <code>ungrounded</code> — from your own idea text,
                captioned <code>unverified · illustrative</code>.
              </li>
              <li>
                Captions carry <code>source: path:lines</code> refs, e.g.{' '}
                <code>{EVIDENCE_EXAMPLE.caption}</code>, so any sentence can be checked in
                seconds.
              </li>
              <li>
                Numbers are copied verbatim from the source text — the extractor never computes,
                rounds, or invents them.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="limits-title" id="limits">
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>05</span>
          <h2 className={styles.sectionTitle} id="limits-title">
            Honest limitations
          </h2>
        </div>
        <div className={styles.limitBox}>
          <h3>What Typodeck will not do (yet)</h3>
          <ul className={styles.limitList}>
            <li>
              <strong>.pptx only.</strong> There is no Slide Markdown, Markdown, or HTML export
              in the codebase — <code>exportToPptx</code> is the whole export surface.
            </li>
            <li>
              <strong>Public repos only.</strong> Private repositories are rejected; retrieval is
              bounded at ≤20 files / ≤200 KB, and caps are disclosed in the run warnings.
            </li>
            <li>
              <strong>Claim quality varies.</strong> In the demo decks we observed numbers lifted
              from badge URLs, badge HTML leaking into slide text, LICENSE boilerplate quoted as
              claims, and duplicate slides. Everything is labeled — but review before you present.
            </li>
            <li>
              <strong>Docs-only repos ground little.</strong> The TypeScript-Handbook deck has 0
              verified / 40 suggestion claims: without code terms to confirm docs, every caption
              honestly says <code>unverified</code>.
            </li>
            <li>
              <strong>Deterministic fallback by default.</strong> Runs without a configured model
              endpoint use the rule-based fallback planner, and say so in the provider badge and
              warnings.
            </li>
          </ul>
        </div>
      </section>

      <div className={`${styles.bleed} ${styles.cta}`}>
        <div className={styles.bleedInner}>
          <h2 className={styles.ctaTitle}>Your repo already wrote the deck. Come collect it.</h2>
          <p className={styles.ctaLede}>
            Generate above, open the Studio for idea mode and the full slide viewer, or read the
            code — the pipeline, validator, and honesty labels are all in the open.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.btnDark} href="/">Open the Studio</a>
            <a className={styles.btnGhost} href={GITHUB_URL}>Typodeck on GitHub</a>
          </div>
        </div>
      </div>

      <footer className={styles.colophon}>
        <p>
          Typodeck landing · demo decks generated 2026-10-30 via planDeck → exportToPptx →
          validatePptx · preview method: HTML-geometry renders from deck JSON ·{' '}
          <a href={GITHUB_URL}>{GITHUB_URL.replace('https://', '')}</a>
        </p>
      </footer>
    </div>
  );
}
