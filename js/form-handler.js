/**
 * Form handler for Pentariver website contact form
 * Handles form submission, validation, and API integration with Web3Forms
 */

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    const result = document.getElementById("result");
    
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Update button state to indicate submission in progress
            const submitBtn = form.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;
            
            // Create result container if it doesn't exist
            if (!result) {
                const resultDiv = document.createElement("div");
                resultDiv.id = "result";
                resultDiv.className = "mt-3";
                form.appendChild(resultDiv);
            }
            
            // Clear previous results
            if (result) {
                result.innerHTML = "";
            }
            
            // Prepare form data for submission
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);
            
            // Submit form data to Web3Forms API
            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            }).then(async(response) => {
                let json = await response.json();
                
                // Reset button state
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                // Handle successful submission
                if (response.status == 200) {
                    if (result) {
                        result.innerHTML = `<div class="alert alert-success">${json.message}</div>`;
                        result.scrollIntoView({behavior: "smooth", block: "center"});
                    }
                    form.reset();
                } else {
                    // Handle API error response
                    console.log(response);
                    if (result) {
                        result.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again later.</div>`;
                        result.scrollIntoView({behavior: "smooth", block: "center"});
                    }
                }
            }).catch(error => {
                // Handle network or other errors
                console.log(error);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                if (result) {
                    result.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again later.</div>`;
                    result.scrollIntoView({behavior: "smooth", block: "center"});
                }
            });
        });
    }
});
