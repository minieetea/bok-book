function pasteBook() {
    //1. 책 정보를 가져오는 애를 호출하자.
    // window.clipboardData.getData('Text');
    // alert(clipboard);

    $.ajax({
        type: "POST",
        url: "/pastebook",
        data: {},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                let info = response["bookinfo"];
                console.log(info);
                let title = info['title'];
                let url = info['url'];
                let desc = info['desc'];
                let author = info['author'];
                let image = info['image'];
                let price = info['price'];
                let isbn = info['isbn'];
                // let ebook_price = info['ebook_price'];
                // if(ebook_price>0)
                //     scrapingResult(title, url, desc, author, image, price, ebook_price);
                // else
                appendHoricard(title, url, desc, author, image, price, isbn);
            }
        }
    })
}

function addWishlist() {
    <!--요소에서 각 값 가져오기-->
    let url = $('#store-url').attr('href');
    let title = $('#title').text();
    let desc = $('#desc').text();
    let author = $('#author').text();
    let image = $('#bookcover').attr('src');
    let price = $('#price').text();
    let isbn = $('#isbn').text();

    console.log('index.html 화면에서 추출완료===============');
    console.log(url); // a 태그의 속성값 가져와야함
    console.log(title);
    console.log(desc);
    console.log(author);
    console.log(image); //img 태그의 속성값 가져와야함
    console.log(price);
    console.log(isbn);
    <!--위시리스트에 추가하기-->
    $.ajax({
        type: "POST",
        url: "/addWishlist",
        data: {url: url, title: title, desc: desc, author: author, image: image, price: price, isbn: isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                alert(response["msg"])
            }
        }
    })
}

function appendHoricard(title, url, desc, author, image, price, isbn) {
    let horicard = `<div class="card">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${image}" class="card-img" id="bookcover">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <a id="store-url" href="${url}"><h5 class="card-title" id="title">${title}</h5></a>
                        <p id="isbn">${isbn}</p>
                        <p class="card-text"><small class="text-muted" id="author">${author}</small><small class="text-muted" id="price">${price}</small></p>
                        <p class="card-text" id="desc">${desc}</p>
                        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                          <div class="btn-group mr-2" role="group" aria-label="button group">
                            <button type="button" class="btn btn-primary"><i class="far fa-credit-card"></i> 복</button>
                            <button type="button" class="btn btn-secondary"><i class="fas fa-wallet"></i> 불복</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="third group">
                            <button type="button" class="btn btn-light"><i class="fas fa-retweet"></i> 빌려보기</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="second group">
                            <button type="button" class="btn btn-light" onclick="addWishlist()"><i class="fas fa-cart-arrow-down"></i> 나중에 사기</button>
                          </div>

                          <div class="alert alert-danger" role="alert">
                              <i class="fas fa-exclamation-triangle"> </i><a href="#" class="alert-link">보유 중인 책(복)</a>입니다. 사기전에 다시 생각하세요.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#book-info').append(horicard);
}

function myWishlist() {
    console.log('위시리스트 조회 시작');
    <!--위시리스트에 전부 조회하기-->
    $.ajax({
        type: "GET",
        url: "/getWishlist",
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("왓다");
                let wishlist = response["wishbooks"]
                for (let i = 0; i < wishlist.length; i++) {
                    let title = wishlist[i]['title'];
                    let desc = wishlist[i]['desc'];
                    let image = wishlist[i]['image'];
                    let url = wishlist[i]['url'];
                    let author = wishlist[i]['author'];
                    let price = wishlist[i]['price'];
                    let isbn = wishlist[i]['isbn'];
                    appendHoricard2(title, url, desc, author, image, price, isbn);
                }
            }
        }
    });
}

function removeWishlist() {
    let isbn = $('#isbn').text();
    $.ajax({
        type: "POST",
        url: "/removeWishlist",
        data: {isbn: isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success")
                console.log("지웠다");
            window.location.reload();
        }
    })
}

function appendHoricard2(title, url, desc, author, image, price, isbn) {
    let horicard = `<div class="card">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${image}" class="card-img" id="bookcover">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <a id="store-url" href="${url}"><h5 class="card-title" id="title">${title}</h5></a>
                        <p id="isbn">${isbn}</p>
                        <p class="card-text"><small class="text-muted" id="author">${author}</small><small class="text-muted" id="price">${price}</small></p>
                        <p class="card-text" id="desc">${desc}</p>
                        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                          <div class="btn-group mr-2" role="group" aria-label="button group">
                            <button type="button" class="btn btn-primary"><i class="far fa-credit-card"></i> 복</button>
                            <button type="button" class="btn btn-secondary"><i class="fas fa-wallet"></i> 불복</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="third group">
                            <button type="button" class="btn btn-light"><i class="fas fa-retweet"></i> 빌려보기</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="second group">
                            <button type="button" class="btn btn-danger" onclick="removeWishlist()"><i class="fas fa-minus-circle"></i> 마음이 바뀜</button>
                          </div>
                          <div class="alert alert-danger" role="alert">
                              <i class="fas fa-exclamation-triangle"> </i><a href="#" class="alert-link">보유 중인 책(복)</a>입니다. 사기전에 다시 생각하세요.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#book-info').append(horicard);
}

function bottomtab() {
    $(this).addClass('active');
    $(this).parent().children('a').not(this).removeClass('active');
}