import { useQuasar, QSpinnerGears } from "quasar";

export default function useDialog() {
  const $q = useQuasar();

  function startLoading() {
    const loadingDialog = $q.dialog({
      title: "Loading...",
      dark: true,
      message: "",
      progress: {
        spinner: QSpinnerGears,
        color: "amber",
      },
      persistent: true, // we want the user to not be able to close it
      ok: false, // we want the user to not be able to close it
    });

    let count = 0;
    const interval = setInterval(() => {
      const dots = [".", "..", "..."];
      count += 1;
      count %= dots.length;
      // we update the dialog
      loadingDialog.update({
        message: `${dots[count]}`,
      });
    }, 500);
    return { loadingDialog, interval };
  }

  function finishLoading(dialogRef, intervalRef, success) {
    if (intervalRef) {
      clearInterval(intervalRef);
    }

    if (success) {
      if (dialogRef) {
        setTimeout(() => {
          dialogRef.hide();
        }, 350);
      }
    } else {
      dialogRef.update({
        title: "Failed",
        message: "Request failed",
        progress: false,
        ok: true,
      });
    }
  }

  function showLoading(loading, success) {
    const loadingDialog = $q
      .dialog({
        title: "Loading...",
        dark: true,
        message: "",
        progress: {
          spinner: QSpinnerGears,
          color: "amber",
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      })
      .onCancel(() => {
        setTimeout(() => {
          loadingDialog.hide();
        }, 350);
      });

    // we simulate some progress here...
    let dots = [".", "..", "..."];
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      count %= dots.length;
      // we update the dialog
      loadingDialog.update({
        message: `${dots[count]}`,
      });
      // if we are done...
      if (loading.value === false) {
        clearInterval(interval);

        if (success.value === true) {
          setTimeout(() => {
            loadingDialog.hide();
          }, 350);
        } else {
          loadingDialog.update({
            title: "Failed",
            message: "Request failed",
            progress: false,
            ok: true,
          });
        }
      }
    }, 500);
  }

  return { startLoading, finishLoading };
}
