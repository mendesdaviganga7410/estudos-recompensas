let cropperInstance = null;
let bannerCropperInstance = null;

function initPhotoPicker() {
    const dropZone  = $("photo-drop-zone");
    const fileInput = $("photo-file-input");
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) processFile(e.target.files[0]);
    });

    dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) processFile(e.dataTransfer.files[0]);
    });

    document.addEventListener("keydown", e => {
        const cropCont = $("crop-container");
        if (cropCont?.style.display === "flex" && e.key === "Enter") {
            e.preventDefault();
            saveCroppedPhoto();
        }
    });
}

function processFile(file) {
    if (!file?.type.startsWith("image/")) {
        toast("Selecione um arquivo de imagem válido.", true);
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        const img = $("image-to-crop");
        img.src = event.target.result;
        $("photo-drop-zone").style.display = "none";
        $("crop-container").style.display  = "flex";

        if (cropperInstance) cropperInstance.destroy();
        cropperInstance = new Cropper(img, {
            aspectRatio: 1,
            viewMode: 1,
            dragMode: "move",
            background: false,
            autoCropArea: 0.8,
            responsive: true,
            restore: false
        });
    };
    reader.readAsDataURL(file);
}

function saveCroppedPhoto() {
    if (!cropperInstance) return;
    const canvas = cropperInstance.getCroppedCanvas({
        width: 256, height: 256,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
    });
    canvas.toBlob(blob => {
        if (!blob) { toast("Erro ao processar imagem.", true); return; }
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        if (window.updateUserProfilePhoto) {
            window.updateUserProfilePhoto(file);
            cancelCrop();
        } else {
            toast("Servidor de sincronização indisponível.", true);
        }
    }, "image/jpeg", 0.85);
}

function cancelCrop() {
    if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; }
    const dropZone  = $("photo-drop-zone");
    const cropCont  = $("crop-container");
    const fileInput = $("photo-file-input");
    if (dropZone)  dropZone.style.display = "block";
    if (cropCont)  cropCont.style.display  = "none";
    if (fileInput) fileInput.value = "";
}

function initBannerPicker() {
    const dropZone  = $("banner-drop-zone");
    const fileInput = $("banner-file-input");
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", e => {
        if (e.target.files.length > 0) processBannerFile(e.target.files[0]);
    });

    dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", e => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) processBannerFile(e.dataTransfer.files[0]);
    });
}

function processBannerFile(file) {
    if (!file?.type.startsWith("image/")) {
        toast("Selecione um arquivo de imagem válido.", true);
        return;
    }
    const reader = new FileReader();
    reader.onload = event => {
        const img = $("banner-image-to-crop");
        img.src = event.target.result;
        $("banner-drop-zone").style.display = "none";
        $("banner-crop-container").style.display  = "flex";

        if (bannerCropperInstance) bannerCropperInstance.destroy();
        bannerCropperInstance = new Cropper(img, {
            aspectRatio: 16 / 5,
            viewMode: 1,
            dragMode: "move",
            background: false,
            autoCropArea: 0.9,
            responsive: true,
            restore: false
        });
    };
    reader.readAsDataURL(file);
}

function saveCroppedBanner() {
    if (!bannerCropperInstance) return;
    const canvas = bannerCropperInstance.getCroppedCanvas({
        width: 1200, height: 375,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high"
    });
    canvas.toBlob(blob => {
        if (!blob) { toast("Erro ao processar imagem.", true); return; }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            if (window.updateUserProfileBanner) {
                window.updateUserProfileBanner(dataUrl);
                cancelBannerCrop();
            } else {
                toast("Servidor de sincronização indisponível.", true);
            }
        };
        reader.readAsDataURL(blob);
    }, "image/jpeg", 0.85);
}

function cancelBannerCrop() {
    if (bannerCropperInstance) { bannerCropperInstance.destroy(); bannerCropperInstance = null; }
    const dropZone = $("banner-drop-zone");
    const cropCont  = $("banner-crop-container");
    const fileInput = $("banner-file-input");
    if (dropZone) dropZone.style.display = "block";
    if (cropCont) cropCont.style.display  = "none";
    if (fileInput) fileInput.value = "";
}

window.cancelCrop        = cancelCrop;
window.saveCroppedPhoto  = saveCroppedPhoto;
window.saveCroppedBanner = saveCroppedBanner;
window.cancelBannerCrop  = cancelBannerCrop;

document.addEventListener("DOMContentLoaded", () => {
    initPhotoPicker();
    initBannerPicker();
});
