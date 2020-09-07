function add_cart() {
    //1. 책 정보를 가져오는 애를 호출하자.
    // window.clipboardData.getData('Text');
    // alert(clipboard);

    $.ajax({
        type: "POST",
        url: "/addCart",
        data: {},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log("카트에 도서 추가 완료");
                view_cart();
            } else
                console.log("!!! 카트에 도서 추가 실패")
        }
    })
}

function view_cart() {
    $('#cart-list').html('');
    console.log('카트 전체 갱신 시작');
    <!--카트 아이템 조회하기-->
    $.ajax({
        type: "GET",
        url: "/viewCart",
        data: {},
        success: function (response) {
            if (response["result"] == "success") {
                console.log(response["msg"])
                console.log("카트 조회 성공");
                let bookcart = response["bookcart"]
                for (let i = 0; i < bookcart.length; i++) {
                    let title = bookcart[i]['title'];
                    let desc = bookcart[i]['desc'];
                    let image = bookcart[i]['image'];
                    let url = bookcart[i]['url'];
                    let author = bookcart[i]['author'];
                    let price = bookcart[i]['price'];
                    let isbn = bookcart[i]['isbn'];
                    console.log("카트아이템:", title, desc, image, url, author, price, isbn)
                    append_horicard(title, url, desc, author, image, price, isbn);
                }
            }
        }
    });
}
function clear_cart() {
    // 임시로 가진 테이블을 모두 지운다
    $.ajax({
        type: "POST",
        url: "/clearCart",
        data: {},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"])
            }
        }
    })

}

function add_wishlist() {
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

function append_horicard(title, url, desc, author, image, price, isbn) {
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
                            <button type="button" class="btn btn-light" onclick="add_wishlist()"><i class="fas fa-cart-arrow-down"></i> 나중에 사기</button>
<!--                            <button type="button" class="btn btn-light" onclick="additemtest()"><i class="fas fa-cart-arrow-down"></i> 나중에 사기</button>-->
                          </div>

                          <div class="alert alert-danger" role="alert">
                              <i class="fas fa-exclamation-triangle"> </i><a href="#" class="alert-link">보유 중인 책(복)</a>입니다. 사기전에 다시 생각하세요.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $('#cart-list').append(horicard);
}

function my_wishlist() {
    console.log('위시리스트 조회 시작');
    <!--위시리스트에 전부 조회하기-->
    $.ajax({
        type: "GET",
        url: "/getWishlist",
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("위시리스트 조회 성공");
                let wishlist = response["wishbooks"]
                for (let i = 0; i < wishlist.length; i++) {
                    let title = wishlist[i]['title'];
                    let desc = wishlist[i]['desc'];
                    let image = wishlist[i]['image'];
                    let url = wishlist[i]['url'];
                    let author = wishlist[i]['author'];
                    let price = wishlist[i]['price'];
                    let isbn = wishlist[i]['isbn'];
                    append_horicard2(title, url, desc, author, image, price, isbn);
                }
            }
        }
    });
}

function remove_wishlist() {
    let isbn = $('#isbn').text();
    $.ajax({
        type: "POST",
        url: "/removeWishlist",
        data: {isbn: isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success")
                console.log("위시리스트 아이템 삭제 성공");
            window.location.reload();
        }
    })
}

function append_horicard2(title, url, desc, author, image, price, isbn) {
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
                            <button type="button" class="btn btn-danger" onclick="remove_wishlist()"><i class="fas fa-minus-circle"></i> 마음이 바뀜</button>
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