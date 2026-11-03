# Typodeck Skill — Intent Discovery (read on demand)

Understand the user's presentation requirements BEFORE generating.
This is a judgment procedure, not a questionnaire. The requirement is
effective intent discovery and user control — never a mandatory
sequence of questions.

## The rule

Ask concise, relevant questions when needed. Never ask for information
already present in the conversation, repository, documents, or previous
answers. A well-specified request must not be obstructed by redundant
questions. A vague request must not silently become an arbitrary deck
built on unjustified assumptions.

## Procedure

1. **Inventory what you already know.** Before asking anything, list
   (to yourself) the facts in hand and where each came from:
   conversation text, attached files, repository contents, prior
   answers, usable defaults (purpose preset P01, English unless the
   user writes Korean, 5–12 slides from content length).
2. **Judge material ambiguity.** A gap is material only if guessing
   would change the deck's story, evidence, or fitness for purpose.
   Cosmetic preferences (system choice, template) are NOT material —
   the engine generates all systems from one narrative for comparison.
3. **Ask at most one batched round, ≤3 questions,** and only when a
   material gap exists. Each question must offer the likely answers as
   options (including what you would assume). One message, then proceed.
4. **Otherwise state assumptions and proceed.** Open with a 2–4 line
   plan the user can edit: content source → purpose preset → systems
   to compare → language → output. Generate on the stated assumptions;
   the plan is the confirmation.
5. **Never re-ask.** If the user already answered, decided, or
   provided content covering a question, treat it as settled — even
   across sessions (check files/notes they pointed at).

## What is usually material

- **Content source**: idea text vs local repo vs public `owner/repo`.
  If the user names a repo, there is no question — inspect it.
- **Purpose/audience**: investor pitch, lecture, launch, status
  update. Maps to `--preset P01..P10` (`references/purposes.md`).
  Default P01 only when the request reads like a general pitch.
- **Language**: English or Korean (`--lang en|ko`). Default to the
  language the user writes in; mixed-script decks follow the
  dominant language.
- **Length**: only when the user signals a constraint (lightning
  talk, 30-minute lecture). Otherwise let content decide (5–12 slides).

## What is NOT worth a question

System/template choice (generate all, compare, export the chosen
one), slide count within 5–12, provider (fallback unless credentials
exist), validation (always gated on `validation: OK`).

## Templates

English — vague request ("make a deck about our project"):

> I can build that. Three quick things: (1) Content — should I use
> this repo, or will you paste text? (2) Audience — investors,
> users, or internal team? (3) Language — English or Korean?
> Defaults if you say "just go": this repo, P01 pitch, English.

English — well-specified request (repo + audience given):

> Plan: repo `owner/repo` → P04 launch arc → all three systems to
> compare → English → editable `.pptx`. Generating now — say
> "change X" to adjust anything.

Korean — vague request ("우리 프로젝트 소개 덱 만들어줘"):

> 만들어드릴게요. 세 가지만 확인할게요: (1) 내용 — 이 저장소를
> 쓸까요, 텍스트를 붙여넣으시겠어요? (2) 청중 — 투자자, 사용자,
> 내부 팀 중 어디인가요? (3) 언어 — 한국어, 영어 중
> 무엇으로 할까요? "그냥 해줘"라고 하시면 저장소·P01·한국어
> 기준으로 진행합니다.

Korean — well-specified request:

> 계획: `owner/repo` 저장소 → P04 런칭 흐름 → 3개 시스템 비교 →
> 한국어 → 편집 가능한 `.pptx`. 바로 생성합니다. 바꾸실 부분은
> "OO 바꿔줘"라고 말씀해 주세요.

## Anti-patterns

- Interrogating step by step (purpose now, length later, …).
- Asking system/template/language the user already stated.
- Generating a 10-slide investor story from "make me a deck"
  with zero confirmation.
- Blocking a complete spec ("repo X, P04, Korean, expressive")
  behind any question at all.
