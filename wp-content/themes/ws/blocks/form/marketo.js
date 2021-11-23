/* globals MktoForms2 */
export default function mktoFormChain(config) {
  const arrayify = getSelection.call.bind([].slice)
  const MKTOFORM_ID_ATTRNAME = 'data-form-id'
  MktoForms2.whenRendered(function(form) {
    const formEl = form.getFormElem()[0]
    const rando = '_' + new Date().getTime() + Math.random()
    arrayify(formEl.querySelectorAll('label[for]')).forEach(function(labelEl) {
      const forEl = formEl.querySelector(`[id="${labelEl.htmlFor}"]`); // eslint-disable-line semi
      if (forEl) {
        labelEl.htmlFor = forEl.id = forEl.id + rando
      }
    })
  })
  /* chain, ensuring only one #mktoForm_nnn exists at a time */
  arrayify(config.formIds).forEach(function(formId) {
    const loadForm = MktoForms2.loadForm.bind(MktoForms2, config.podId, config.munchkinId, formId)
    const formEls = arrayify(document.querySelectorAll(`[${MKTOFORM_ID_ATTRNAME}="${formId}"]`));
    (function loadFormCb(formEls) {
      const formEl = formEls.shift()
      formEl.id = 'mktoForm_' + formId
      loadForm(function() {
        formEl.id = ''
        if (formEls.length) {
          loadFormCb(formEls)
        }
      })
    })(formEls)
  })
}
