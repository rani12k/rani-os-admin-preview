// DEV-BASELINE-RESTORE-003
// DEV runs the repository-defined CR-016 Golden Baseline from PR #14.
(function loadCanonicalAdminBaseline(){
  const current = document.currentScript ? document.currentScript.src : location.href;
  const canonical = new URL('app-cr016.js?build=dev-baseline-restore-003', current);
  const script = document.createElement('script');
  script.src = canonical.href;
  script.async = false;
  document.head.appendChild(script);
})();
