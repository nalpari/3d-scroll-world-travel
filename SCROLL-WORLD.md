# ODD — 스크롤 월드 빌드 노트

스크롤이 카메라를 구동해 미니어처 한국 위를 나는 랜딩. 6개 씬을 다이브 + 커넥터로
이어 붙인 하나의 연속 비행이며, 페이지는 사전 렌더된 영상을 스크롤 위치로 스크럽할 뿐입니다.

`scroll-world` 스킬로 만들었습니다. 스킬 원문: `~/.claude/plugins/cache/scroll-world/`

## 구성

| | |
|---|---|
| 여정 | 설악산 → 정동진 → 하회마을 → 보성 녹차밭 → 순천만 → 성산일출봉 (지리 순: 강원→경북→전남→제주) |
| 카메라 | Architecture B — 씬 안으로 다이브, 하늘로 빠져나와 지도 위를 날아 다음 씬으로 |
| 스틸 | Codex `image_gen` (gpt-image-2), 1536×1024 3:2, 크레딧 0 |
| 영상 | Higgsfield MCP `kling3_0` `mode: std` — 다이브 10초, 커넥터 5초 |
| 데스크톱 | 1280×720, crf 20, GOP 8 |
| 모바일 | 네이티브 9:16 720×1280, crf 23, GOP 4 (크롭 아님) |
| 총 비용 | 315 크레딧 |

## 파일

```
public/scroll-world-engine.js   스킬 원본과 바이트 동일 — 수정 금지 (스킬 업데이트를 그대로 받기 위함)
public/sw/*.webp                포스터 12장 (가로 6 + 세로 6, 각 다이브의 frame 0)
public/sw/vid/*.mp4             클립 22개 (가로 11 + 세로 11)
src/app/world-config.ts         섹션·카피·에셋 경로
src/app/page.tsx                엔진 마운트 (클라이언트 컴포넌트)
src/app/globals.css             ODD 테마 토큰 + 한글 타이포 오버라이드
.scrollworld/                   생성 작업 공간 (gitignore) — 원본 렌더, 프롬프트, seam 프레임
```

엔진을 수정하는 대신 `globals.css`에서 **레이어 없는(unlayered)** 셀렉터로 덮어씁니다.
엔진 CSS는 `@layer sw` 안에 있어서 레이어 없는 규칙이 항상 이깁니다.

## 재현할 때 반드시 알아야 할 것

**1. Higgsfield 플랜 게이트 — 1080p는 starter로 불가.**
`seedance_2_0`은 480p·4초조차 "Requires plus plan or higher"로 거부됩니다. 모델 자체가
Plus 전용입니다. `kling3_0`도 `mode: pro` / `4k`는 막히고 `std`만 열립니다.
starter에서 프레임 락이 되는 모델은 **`kling3_0 std`와 `seedance_2_0_mini`** 둘뿐입니다.

**2. kling은 `aspect_ratio`를 무시하고 입력 이미지 비율을 따라갑니다.**
3:2 스틸을 그대로 주면 `aspect_ratio: "16:9"`를 넘겨도 1176×784(3:2)가 나옵니다.
그래서 스틸을 **리샘플링 없이** 캔버스에 패딩해서 넣습니다:

```bash
# 16:9 (데스크톱) — 1536x1024 스틸을 1920x1080 중앙에, 가장자리는 자기 그라데이션을 연장
ffmpeg -i still.png -vf "pad=1920:1080:192:28:0x000000,\
fillborders=left=192:right=192:top=28:bottom=28:mode=smear" canvas.png
```

`fillborders=smear`가 핵심입니다. 스틸 배경에 미세한 비네팅이 있어 평면 색으로 패딩하면
경계선이 보이고, 그 프레임이 그대로 포스터가 됩니다. 중앙 영역은 PSNR=inf(무손실)로 보존됩니다.
세로 체인은 `scale=1014:676,pad=1080:1920:33:526` + 같은 smear.

**3. seam 법칙 — 커넥터의 양 끝점은 반드시 "실제 렌더된 프레임"이어야 합니다.**
원본 스틸을 쓰면 안 됩니다. 매 생성이 조금씩 다르게 렌더되므로 이음매에서 튑니다.

```
커넥터 i:  start_image = 다이브 i 의 마지막 프레임
           end_image   = 다이브 i+1 의 첫 프레임   (둘 다 렌더된 mp4에서 추출)
```

이 빌드의 실측: 다이브→커넥터 이음매 **36~39 dB**(픽셀 수준), 커넥터→다이브는 대부분
33~39 dB, 일부 21~26 dB(구도는 동일, 미세 스케일 드리프트 — 엔진 크로스페이드가 덮음).
**판정은 PSNR 숫자가 아니라 구도로 합니다.** 소품·구성이 다르면 실패, 흐릿하기만 하면 정상.

**4. Codex 스틸은 세션마다 작업 디렉터리를 분리해야 합니다.**
병렬 `codex exec` 세 개를 같은 디렉터리에서 돌렸더니 한 씬의 PNG가 다른 씬 것으로
덮어써졌습니다(md5 동일). 스킬이 경고하는 stdin 문제와는 별개입니다.
`.scrollworld/gen_still_codex.sh`가 세션별 `gen_N/` 디렉터리를 씁니다. `< /dev/null`도 유지하세요.

**5. `generate_audio` / `sound` 기본값이 켜져 있습니다.** 매 클립 `sound: "off"`를 넘기세요
(스킬 문서는 CLI 기준으로 "이 플래그는 에러난다"고 하지만 MCP는 정반대입니다).

**6. 프리셋 추천으로 제출이 반려될 수 있습니다.** `"Preset X was recommended instead of
submitting a job"` → 같은 요청에 `declined_preset_id`를 붙여 재제출합니다.

**7. MCP는 로컬 파일을 못 받습니다.** `media_upload` → `curl -T` presigned URL →
`media_confirm` → 받은 UUID를 `medias[].value`로 넘깁니다. URL이나 경로는 거부됩니다.

## 다시 굽기

`.scrollworld/`에 프롬프트(`still_*.txt`, `dive_*.txt`, `conn_*.txt`), 원본 렌더,
seam 프레임, 인코드 스크립트가 모두 남아 있습니다.

```bash
bash .scrollworld/gen_still_codex.sh 4   # 씬 4 스틸만 다시
bash .scrollworld/encode_mobile.sh       # 모바일 재인코딩
```

한 씬만 교체하려면: 스틸 재생성 → 캔버스 → 다이브 → **그 씬에 붙는 커넥터 2개도 함께**
재생성(양옆 프레임이 바뀌므로). 비용은 다이브 15 + 커넥터 15 = 30 크레딧.

## 알아둘 점

- 전체 에셋 94MB. 엔진이 스크롤 위치 주변만 지연 로드하므로 초기 로드는 가볍지만,
  끝까지 스크롤하면 데스크톱 ~55MB / 모바일 ~38MB를 받습니다. 이 기법의 본질적 비용입니다.
- 영상은 blob URL로 로드됩니다. 호스트가 HTTP range 요청을 지원하지 않아도 스크럽됩니다.
- `prefers-reduced-motion`에서는 영상을 아예 로드하지 않고 스틸만 교차 디졸브합니다 (검증됨).
- 1080p로 올리려면 Plus 업그레이드 후 `seedance_2_0` 1080p로 재렌더하면 됩니다.
  스틸·프롬프트·seam 방법은 그대로 재사용되므로 체인만 다시 돌리면 됩니다 (약 985 크레딧).
