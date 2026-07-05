// DEV-BASELINE-RESTORE-002
// DEV intentionally runs the repository-defined CR-016 Admin baseline.
// Do not add Workflow Hub, Development Tools, or ad-hoc UX here.
(function loadCanonicalAdminBaseline(){
  const current = document.currentScript ? document.currentScript.src : location.href;
  const canonical = new URL('app-cr016.js?build=dev-baseline-restore-002', current);
  const script = document.createElement('script');
  script.src = canonical.href;
  script.async = false;
  document.head.appendChild(script);
})();
