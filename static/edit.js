const disableAll = () => {
    document.getElementsByTagName('input').forEach(input => input.disabled = true);
}

const enable = () => {
    document.getElementsByTagName('input').forEach(input => input.dataset.f ? '' : input.disabled = false);
}

const download = () => {

    $("#table-content").text($("#table-container").html());
    console.log($("#table-content").html());

    $("#downloader").submit();

}