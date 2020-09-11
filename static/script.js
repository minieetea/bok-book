function add_cart() { // url 스크랩핑한 책 정보를 말아서 카트에 넣는다. (작업완료)
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

function view_cart() { // 카트 아이템 조회하기 (작업완료)
    $('#cart-list').html('');
    console.log('카트 전체 갱신 시작');

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

function clear_cart() { // 임시테이블을 삭제한다. (작업완료)
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


function add_wishlist(btnclass) { //선택한 아이템을 위시리스트로 옮겨야한다. #11
    let item_isbn = get_isbn(btnclass)
    console.log("추가하려고 함:", item_isbn)

    $.ajax({
        type: "POST",
        url: "/addWishlist",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"])
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
                        <p class="card-text"><small class="text-muted" id="author">${author}</small><small class="text-muted" id="price">${price}</small></p>
                        <p class="card-text" id="desc">${desc}</p>
                        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups"  name="isbn" value="${isbn}">
                          <div class="btn-group mr-2" role="group" aria-label="button group">
                            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#input-buy-info"><i class="fas fa-book"></i> 소장하기</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="second group">
                             <button type="button" class="btn btn-light btn-wishlist" onclick="add_wishlist(this)"> <i class="fas fa-cart-arrow-down"></i> 나중에 사기</button>
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

function my_wishlist() { // 위시리스트를 조회한다.
    console.log('위시리스트 조회 시작');

    $.ajax({
        type: "GET",
        url: "/viewWishlist",
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

function remove_wishlist(btnclass) { //위시리스트를 제거한다. (개선필요)
    let item_isbn = get_isbn(btnclass)
    console.log("제거하려고 함:", item_isbn)
    $.ajax({
        type: "POST",
        url: "/removeWishlist",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success")
                console.log("위시리스트 아이템 삭제 성공");
            else
                console.log("왠지 모르지만 실패")
            window.location.reload();
        }
    })
}

function get_isbn(btnclass) {
    let isbn = $(btnclass).parents().children('.btn-toolbar').attr("value")
    return isbn
}

function append_horicard2(title, url, desc, author, image, price, isbn) {
    let horicard =
        `<div class="card">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${image}" class="card-img" id="bookcover">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <a id="store-url" href="${url}"><h5 class="card-title" id="title">${title}</h5></a>
                        <p class="card-text"><small class="text-muted" id="author">${author}</small><small class="text-muted" id="price">${price}</small></p>
                        <p class="card-text" id="desc">${desc}</p>
                        <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups"  name="isbn" value="${isbn}">
                          <div class="btn-group mr-2" role="group" aria-label="button group">
                            <button type="button" class="btn btn-primary btn-buy" data-toggle="modal" data-target="#input-buy-info"><i class="fas fa-book"></i> 소장하기</button>
                          </div>
                          <div class="btn-group mr-1" role="group" aria-label="second group">
                            <button type="button" class="btn btn-danger btn-remove" onclick="remove_wishlist(this)"><i class="fas fa-minus-circle"></i> 마음이 바뀜</button>
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

function add_mybook(btnclass) { //책을 사려고한다.
    let item_isbn = get_isbn(btnclass)
    console.log("사려고 함:", item_isbn)

    // $.ajax({
    //     type: "POST",
    //     url: "/add_mybook",
    //     data: {isbn: item_isbn},
    //     success: function (response) { // 성공하면
    //         if (response["result"] == "success") {
    //             console.log(response["msg"])
    //         }
    //     }
    // })
}


// function bottomtab() {
//     $(this).addClass('active');
//     $(this).parent().children('a').not(this).removeClass('active');
// }