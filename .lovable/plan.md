# 모바일 설정 메뉴 검증 결과 및 수정 계획

## 검증 결과 (390x844 뷰포트)

1. **코그 첫 탭** → 정상. 서브 메뉴 열림 (Manual / Templates / Pilot / Reset / Logout 아이콘 노출).
2. **Manual 첫 탭** → **버그**. 모달이 뜨지 않고, 동시에 코그 자체도 사라져 사용자가 갇힘.

## 원인

`HeaderBar.tsx` 구조상 `ManualPanel`과 `TemplatePanel`이 fly-out `motion.div` **내부**에 렌더링됩니다.

```
fly-out (조건: hubOpen && !manualOpen)
 ├─ SubIcon(Manual)  →  setManualOpen(true)
 └─ ManualPanel (portal 호출)
```

Manual을 탭하면 `manualOpen=true` → fly-out의 조건이 거짓이 되어 **fly-out 전체가 언마운트** → 그 안의 `ManualPanel`도 언마운트 → portal로 띄운 모달이 즉시 사라집니다. 동시에 코그도 `{!manualOpen && ...}` 가드로 숨겨져 화면에서 모든 진입점이 사라집니다.

Templates도 같은 구조이지만 fly-out 조건은 `manualOpen` 한 가지만 보므로 살아남고, 그래서 우연히 동작합니다. Manual만 깨져 있습니다.

## 수정 계획

`src/components/HeaderBar.tsx` 한 파일만 수정합니다.

1. **ManualPanel을 컴포넌트 최상위로 끌어올리기**  
   현재 fly-out 안에 있는 `<ManualPanel ... />`을 제거하고, 파일 하단 `<PilotProfilePanel ... />` 옆 (root fragment 직속)에 한 번만 렌더링. 이러면 `hubOpen` / `manualOpen` 변화와 무관하게 모달이 살아 있음.

2. **fly-out 가드 단순화**  
   `hubOpen && !manualOpen` → `hubOpen`. Manual이 열렸을 때 fly-out을 굳이 언마운트할 이유가 없음 (모달이 위에 backdrop으로 덮음).

3. **코그 숨김 가드 제거**  
   `{!manualOpen && (<Tooltip>...코그...</Tooltip>)}` → 항상 렌더. 모달이 backdrop+blur로 가리므로 코그가 보여도 시각적 충돌 없음. 사용자가 갇히는 상황을 원천 차단.

4. **TemplatePanel은 그대로 둠**  
   Templates 패널은 코그 옆에 떠야 하는 위치-종속적인 작은 팝오버라 fly-out 내부 위치가 맞음. 모달 형태가 아닌 데다 동작도 정상.

## 검증 단계

브라우저 자동화로 390x844에서:
- 코그 탭 → 서브 메뉴 노출
- Manual 첫 탭 → Mission Manual 모달 노출 (스크린샷 확인)
- 모달 X 버튼 첫 탭 → 모달 닫힘
- Templates 첫 탭 → 템플릿 팝오버 노출
- Pilot Profile / Reset / Logout 각각 첫 탭 onClick 동작 확인
- 데스크톱(1280px)에서 Tooltip hover와 Manual 모달 모두 정상 동작 회귀 확인
