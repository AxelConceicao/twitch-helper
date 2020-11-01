function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now()
  ;(function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback()
      return
    } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) return
        loopSearch()
      }, checkFrequencyInMs)
    }
  })()
}

function getFileName() {
  streamerName = document.querySelector('.channel-info-content .tw-title').innerHTML
  directoryName = document.querySelector('.channel-info-content a[href^="/directory/game/"] p')
    .innerHTML
  clipName = document.querySelector('[data-a-target=stream-title]').innerHTML
  filename = streamerName + ' - ' + directoryName + ' - ' + clipName + '.mp4'
  filename = filename.replace(/[\\/:*?"<>|]/g, '_')
  return filename
}

function addButton() {
  context = document.querySelector('[data-test-selector="clips-watch-full-button"]').parentElement
  context.insertAdjacentHTML(
    'beforebegin',
    `
    <div class="tw-mg-r-1 th-download-btn">
      <a
        class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--primary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
      >
        <div class="tw-align-items-center tw-core-button-label tw-flex tw-flex-grow-0">
          <div data-a-target="tw-core-button-label-text" class="tw-flex-grow-0">Download Clip</div>
        </div>
      </a>
    </div> 
    `
  )
  downloadBtn = document.getElementsByClassName('th-download-btn')[0].getElementsByTagName('a')[0]
  downloadBtn.onclick = function () {
    let url = document.getElementsByTagName('video')[0].src
    let filename = getFileName()
    console.log('[ATCD] Downloading "' + filename + '" from ' + url)
    chrome.runtime.sendMessage({ url, filename })
  }
}

waitForElementToDisplay('[data-test-selector=clips-watch-full-button]', addButton, 100, 5000)