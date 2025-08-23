// Hey J, query THIS 🖕

$(document).ready(function () {
    const $navList = $("#windowlist");
    const $navTitle = $("#windowlisttitle");

    function updateTitleVisibility() {
        const hasItems = $navList.children("li.restoreitem, li.restoreallitem").length > 0;
        $navTitle.toggle(hasItems); // If .toggle takes an argument of true, it shows. If false, it hides.
        $navList.toggle(hasItems);
    }

    function updateRestoreAll() {
        const $restoreItems = $navList.children("li.restoreitem");
        const $existingRestoreAll = $navList.children("li.restoreallitem");

        if ($restoreItems.length >= 2 && $existingRestoreAll.length === 0) {
            const $restoreAllItem = $("<li>")
            .text("Restore all")
            .addClass("restoreallitem")

            .on("click", function () {
                const itemsToRestore = $navList.children("li.restoreitem").toArray();

                itemsToRestore.forEach(function (item) {
                    const $item = $(item);
                    const boxId = $item.data("box-id");
                    restoreBox(boxId);
                    $item.remove(); // Remove individual restore buttons.
                });
                $(this).remove(); // Remove the restore all button.
                updateTitleVisibility();
            });

            $navList.append($restoreAllItem);
        } else if ($restoreItems.length < 2 && $existingRestoreAll.length > 0) {
            $existingRestoreAll.remove();
        }

        updateTitleVisibility();
    }

    function createRestoreItem($box) {
        const boxId = $box.attr("id");
        const title = $box.data("title");

        return $("<li>").text(`${title}`).attr("data-box-id", boxId).addClass("restoreitem").on("click", function () {
            restoreBox(boxId);
            $(this).remove();
            updateRestoreAll();
        });
    }

    function restoreBox(boxId) {
        const $box = $(`#${boxId}`);
        $box.show();
        $box.removeClass("pinned");

        // I spent 15 minutes feeling like a failure cos I couldn't get this piece of shit script to work and then realised I'd called the class 'pinunpin' and not just 'pin'.
        const $pinBtn = $box.find(".iconbox.pinunpin");
        $pinBtn.removeClass("active");
        $pinBtn.find(".icon").attr("src", $pinBtn.data("original"));

        // const $minMaxBtn = $box.find(".iconbox.minmax");
        // $minMaxBtn.removeClass("active");
        // $minMaxBtn.find(".icon").attr("src", $minMaxBtn.data("original"));
        // $box.find(".boxbody").delay(200).slideDown(200);

        $box.find(".close").removeClass("roundediconleft");
        $box.find(".pinunpin").removeClass("roundediconright")
    }

    // Handles clicking the min/max button, pin/unpin button, and player control buttons.
    $(".iconbox").not(".close").each(function () {
        const $btn = $(this);
        const $icon = $btn.find(".icon");
        const originalSrc = $btn.data("original");
        const activeSrc = $btn.data("active");

        $btn.on("click", function () {
            $btn.toggleClass("active");
            if ($btn.parent("#controls").length > 0) { setTimeout(() => $btn.removeClass("active"), 150); }
            $icon.attr("src", $btn.hasClass("active") ? activeSrc : originalSrc);

            const $box = $btn.closest(".box");
            const $boxBody = $box.find(".boxbody");
            const $close = $box.find(".close");
            const $pinUnpin = $box.find(".pinunpin");

            if ($btn.hasClass("minmax")) {
                $boxBody.toggle();
            } else if ($btn.hasClass("pinunpin")) {
                $box.toggleClass("pinned");
            }
        });
    });

    // Handles clicking the close button.
    $(".iconbox.close").not("#playlistwindow .close").on("click", function () {
        const $box = $(this).closest(".box");
        const boxId = $box.attr("id");

        $box.hide();
        if (boxId === "player") { $("#playlistwindow").hide(); }

        const $listItem = createRestoreItem($box);
        const $restoreAllItem = $navList.children("li.restoreallitem");

        if ($restoreAllItem.length > 0) {
            $listItem.insertBefore($restoreAllItem);
        } else {
            $navList.append($listItem);
        }

        updateRestoreAll();
    });

    $("#togglecredits").on("click", function () {
        $("#credits ul").toggle();
        $("#credits ul").is(":visible") ? $("#togglecredits").text("Credits⮟") : $("#togglecredits").text("Credits⮞");
    });

    // Handles the keyboard shortcuts.
    $(document).on("keydown", function (e) {
        if (e.key === "Delete") {
            $(".box").not("#nav").not("#playlistwindow").each(function () {
                const $box = $(this);
                if (!$box.hasClass("pinned") && $box.is(":visible")) {
                    $box.hide();
                    const $listItem = createRestoreItem($box);
                    const $restoreAllItem = $navList.children("li.restoreallitem");

                    if ($restoreAllItem.length > 0) {
                        $listItem.insertBefore($restoreAllItem);
                    } else {
                        $navList.append($listItem);
                    }
                }
            });
            $("#playlistwindow").hide();
            updateRestoreAll();
        } else if (e.key === "Escape") {
            $navList.children("li.restoreitem").each(function () {
                const boxId = $(this).data("box-id");
                restoreBox(boxId);
                $(this).remove();
            });
            $navList.children("li.restoreallitem").remove();
            updateTitleVisibility();
        }
    });
});
