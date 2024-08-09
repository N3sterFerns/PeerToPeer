const mainPage = document.querySelector("#mainPage")

// Function to create and show the danger toast notification
export function showDangerToast(message) {
    // Create the main toast container
    const toast = document.createElement('div');
    toast.id = 'toast-danger';
    toast.class = 'flex absolute left-1/2 mt-10 -translate-x-1/2 items-center w-full max-w-xs p-4 py-3 mb-4 text-gray-500 bg-white rounded-lg shadow';
    toast.setAttribute('role', 'alert');

    // Create the icon container
    const iconContainer = document.createElement('div');
    iconContainer.class = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg text-red-500';
    
    // Create the SVG icon
    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.classList.add('w-5', 'h-5');
    svgIcon.setAttribute('aria-hidden', 'true');
    svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgIcon.setAttribute('fill', 'red');
    svgIcon.setAttribute('viewBox', '0 0 20 20');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z');
    
    svgIcon.appendChild(path);
    iconContainer.appendChild(svgIcon);
    
    // Create the message container
    const messageContainer = document.createElement('div');
    messageContainer.class = 'ms-3 text-xl font-semibold text-red-500';
    messageContainer.textContent = message;

    // Append all elements to the toast container
    toast.appendChild(iconContainer);
    toast.appendChild(messageContainer);

    // Append the toast to the body
    mainPage.appendChild(toast);

    // setTimeout(() => {
    //     mainPage.removeChild(toast);
    // }, 1500); 
}


