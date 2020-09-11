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
                    append_vercard_wish(title, url, desc, author, image, price, isbn);
                }
            }
        }
    });
}

function add_wishlist() { //선택한 아이템을 위시리스트로 옮겨야한다. #11
    $.ajax({
        type: "POST",
        url: "/addWishlist",
        data: {},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"])
                // window.location.reload();
                $("#wish-info").html("");
                my_wishlist()
            }
        }
    })
}

function my_books() { // 위시리스트를 조회한다.
    console.log('내 서재 조회 시작');

    $.ajax({
        type: "GET",
        url: "/viewMybooks",
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("내 서재 조회 성공");
                let wishlist = response["mybooks"]
                for (let i = 0; i < wishlist.length; i++) {
                    let title = wishlist[i]['title'];
                    let desc = wishlist[i]['desc'];
                    let image = wishlist[i]['image'];
                    let url = wishlist[i]['url'];
                    let author = wishlist[i]['author'];
                    let price = wishlist[i]['price'];
                    let isbn = wishlist[i]['isbn'];
                    append_vercard(title, url, desc, author, image, price, isbn);
                }
            }
        }
    });
}

function remove_wishlist(item) { //위시리스트를 제거한다. (개선필요)
    let item_isbn = item
    console.log("제거하려고 함:", item)
    $.ajax({
        type: "POST",
        url: "/removeWishlist",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success")
                console.log("위시리스트 아이템 삭제 성공");
            else
                console.log("왠지 모르지만 실패")
            $("#wish-info").html("");
            my_wishlist();
        }
    })
}

function buy_mybook(item) { //위시리스트에 넣어둔 책을 사려고한다.
    let item_isbn = item
    console.log("사려고 함:", item)

    $.ajax({
        type: "POST",
        url: "/buyMybook",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"])
                $("#wish-info").html("");
                my_wishlist();
            }
        }
    })
}

function add_mybook() { //바로 책에 추가한다.
    $.ajax({
        type: "POST",
        url: "/addMybook",
        data: {},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"])
                window.location.reload();
            }
        }
    })
}

function append_vercard(title, url, desc, author, image, price, isbn) {
    let vercard =
        `     <div class="reading-book-card">
                    <div class="progress">
                      <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
                    </div>
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" onclick="alert('test')">펼치기</button>
                          <button type="button" class="text-button right" onclick="alert('test')">덮어두기</button>
                        </div>
                     </div>
                  </div>`
    $('#book-info').append(vercard);
}

function append_vercard_wish(title, url, desc, author, image, price, isbn) {
    let vercard =
        `     <div class="reading-book-card">
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" onclick="buy_mybook(${isbn})">구입완료</button>
                          <button type="button" class="text-button right" onclick="remove_wishlist(${isbn})">삭제하기</button>
                        </div>
                     </div>
                  </div>`
    $('#wish-info').append(vercard);
}