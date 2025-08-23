$(document).ready(function () {
    const proverbs = [
        {
            romaji: "Gyoku no hayanige wa hatte no toku ari",
            japanese: "玉の早逃げは八手の得あり",
            english: "An early escape of the king is worth eight moves.",
            image: "media/oushou.svg",
            promotedImage: "media/gyokushou.svg"
            // Obviously the Jeweled isn't a promoted King but that's what the key's called so that's what the value is.
        },
        {
            romaji: "Gyoku no mamori wa kin-gin sammai",
            japanese: "玉の守りは金銀三枚",
            english: "Defend the king with three generals.",
            image: "media/oushou.svg",
            promotedImage: "media/gyokushou.svg"
        },
        {
            romaji: "Ryuu wa tekijin ni, uma wa jijin",
            japanese: "竜は敵陣に、馬は自陣",
            english: "The dragon to the enemy camp, the horse to your own.",
            image: "media/hisha.svg",
            promotedImage: "media/ryuuou.svg"
        },
        {
            romaji: "Hisha no shuhei wa gin",
            japanese: "飛車の手兵は銀",
            english: "The rook's page is the silver.",
            image: "media/hisha.svg",
            promotedImage: "media/ryuuou.svg"
        },
        {
            romaji: "Jikyuusen ni wa kaku ga shuuyaku",
            japanese: "持久戦には角が主役",
            english: "In a slow game the bishop has the leading role.",
            image: "media/kakugyou.svg",
            promotedImage: "media/ryuuma.svg"
        },
        {
            romaji: "Toomi no kaku ni myooshu ari",
            japanese: "遠見の角に妙手あり",
            english: "With a watchtower bishop there is bound to be a brilliant move.",
            image: "media/kakugyou.svg",
            promotedImage: "media/ryuuma.svg"
        },
        {
            romaji: "Kin nashi shoogi ni uke-te nashi",
            japanese: "金なし将棋に受け手なし",
            english: "Without gold in hand there is no defence.",
            image: "media/kinshou.svg"
        },
        {
            romaji: "Kin wa naname ni sasoe",
            japanese: "金は斜めに誘え",
            english: "Entice the gold diagonally forwards.",
            image: "media/kinshou.svg"
        },
        {
            romaji: "Kabegin o naose",
            japanese: "壁銀を直せ",
            english: "Mend the wall-silver.",
            image: "media/ginshou.svg",
            promotedImage: "media/narigin.svg"
        },
        {
            romaji: "Keisaki no gin jooseki nari",
            japanese: "桂先の銀定跡なり",
            english: "Silver at the head of the knight is the standard move.",
            image: "media/ginshou.svg",
            promotedImage: "media/narigin.svg"
        },
        {
            romaji: "Keima no takatobi fu no ejiki",
            japanese: "桂馬の高とび歩の餌食",
            english: "The knight that jumps high falls prey to a pawn.",
            image: "media/keima.svg",
            promotedImage: "media/narikei.svg"
        },
        {
            romaji: "San-kei areba tsumanu koto nashi",
            japanese: "三桂あれば詰まぬことなし",
            english: "With three knights in hand, there must be a mate.",
            image: "media/keima.svg",
            promotedImage: "media/narikei.svg"
        },
        {
            romaji: "Kyoo wa gedan kara ute",
            japanese: "香は下段から打て",
            english: "Drop the lance on the back rank.",
            image: "media/kyousha.svg",
            promotedImage: "media/narikyou.svg"
        },
        {
            romaji: "Kinsoko no fu wa iwa yori katashi",
            japanese: "金底の歩は岩より固し",
            english: "A pawn-anchored gold is more solid than a rock.",
            image: "media/fuhyou.svg",
            promotedImage: "media/tokin.svg"
        },
        {
            romaji: "Ichifu senkin",
            japanese: "一歩千金",
            english: "A pawn is worth a thousand golds.",
            image: "media/fuhyou.svg",
            promotedImage: "media/tokin.svg"
        },
        {
            romaji: "Fu no nai shoogi wa makeshoogi",
            japanese: "歩のない将棋は負け将棋",
            english: "Without pawns in hand the game is lost.",
            image: "media/fuhyou.svg",
            promotedImage: "media/tokin.svg"
        },
        {
            romaji: "Okame hachimoku",
            japanese: "岡目八目",
            english: "The bystander sees the best of the game.",
            image: "media/blank.svg"
        },
        {
            romaji: "Ryootori nigeru ni oyobazu",
            japanese: "両取り逃げるに及ばず",
            english: "Don't run from a fork.",
            image: "media/blank.svg"
        }
    ];

    const $romaji = $("#romaji");
    const $japanese = $("#japanese");
    const $english = $("#english");
    const $image = $("#shogipiece");

    let proverbNum = Math.floor(Math.random() * proverbs.length);
    loadProverb(proverbNum);

    function loadProverb(num) {
        $romaji.text(proverbs[num].romaji);
        $japanese.text(proverbs[num].japanese);
        $english.text(proverbs[num].english);
        $image.attr("src", proverbs[num].image);
        $image.removeClass("promoted");
        $image.removeClass("clickable");

        if (proverbs[num].promotedImage) {
            $image.addClass("clickable");
        }
    }

    setInterval(() => {
        proverbNum = Math.floor(Math.random() * proverbs.length);
        loadProverb(proverbNum);
    }, 15000);

    $image.on("click", function () {
        if ($image.hasClass("clickable")) {
            $image.toggleClass("promoted");
            $image.attr("src", $image.hasClass("promoted") ? proverbs[proverbNum].promotedImage : proverbs[proverbNum].image);
        }
    });
});
