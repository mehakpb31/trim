document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("website-form");
    const logoInput = document.getElementById("logoUpload");
    const galleryInput = document.getElementById("multiImageUpload");
    const logoUrlField = document.getElementById("logoUrl");
    const galleryUrlsField = document.getElementById("galleryUrls");
    const formResult = document.getElementById("form-result");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      formResult.innerHTML = "⏳ Uploading images to Cloudinary...";
  
      try {
        // Upload logo image if selected
        if (logoInput && logoInput.files.length > 0) {
          const logoUrl = await uploadToCloudinary(logoInput.files[0]);
          logoUrlField.value = logoUrl;
        }
  
        // Upload multiple gallery images
        if (galleryInput && galleryInput.files.length > 0) {
          const urls = [];
          for (let file of galleryInput.files) {
            const url = await uploadToCloudinary(file);
            urls.push(url);
          }
          galleryUrlsField.value = urls.join(", ");
        }
  
        formResult.innerHTML = "✅ Upload complete. Submitting form...";
  
        // Prepare form data for Web3Forms submission
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => {
          object[key] = value;
        });
        const json = JSON.stringify(object);
  
        // Submit to Web3Forms API
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: json,
        });
  
        const resultJson = await response.json();
  
        if (response.status === 200) {
          formResult.innerHTML = `<div class="alert alert-success">${resultJson.message}</div>`;
          form.reset();
          formResult.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          formResult.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again later.</div>`;
          formResult.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (err) {
        console.error(err);
        formResult.innerHTML = `<span style="color:red;">❌ Error uploading images or submitting form: ${err.message}</span>`;
        formResult.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  
    async function uploadToCloudinary(file) {
      const cloudName = "ddabplhpc"; // Replace with your Cloudinary cloud name
      const uploadPreset = "unsigned_form_upload"; // Replace if different
  
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
  
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });
  
      const result = await res.json();
  
      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("Image upload failed.");
      }
    }
  });