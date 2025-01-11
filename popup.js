let isRunning = false;

// Start button logic
document.getElementById("start").addEventListener("click", () => {
  const intervalSeconds = parseInt(document.getElementById("interval").value, 10);
  const intervalMs = intervalSeconds * 1000; // Convert seconds to milliseconds
  
  // Inject the auto-clicker script into the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: startAutoClicker,
      args: [intervalMs],
    });
  });

  // Update button states and status message
  isRunning = true;
  toggleButtons();
  updateStatus(`Auto-click started! Interval: ${intervalSeconds} seconds`);
});

// Stop button logic
document.getElementById("stop").addEventListener("click", () => {
  // Stop the auto-clicker in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: stopAutoClicker,
    });
  });

  // Update button states and status message
  isRunning = false;
  toggleButtons();
  updateStatus("Auto-click stopped!");
});

// Toggle button states
function toggleButtons() {
  document.getElementById("start").disabled = isRunning;
  document.getElementById("stop").disabled = !isRunning;
}

// Update the status message
function updateStatus(message) {
  document.getElementById("status").textContent = message;
}

// Auto-clicker functions (to be executed in the webpage context)
function startAutoClicker(interval) {
  if (window.autoClickerInterval) return;

  let currentMousePos = { x: 0, y: 0 };

  // Track mouse position
  document.addEventListener("mousemove", (event) => {
    currentMousePos = { x: event.clientX, y: event.clientY };
  });

  // Click at mouse position
  window.autoClickerInterval = setInterval(() => {
    const element = document.elementFromPoint(currentMousePos.x, currentMousePos.y);
    if (element) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      element.dispatchEvent(clickEvent);
    }
  }, interval);
}

function stopAutoClicker() {
  clearInterval(window.autoClickerInterval);
  window.autoClickerInterval = null;
}
