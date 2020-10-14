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
                    let image = wishlist[i]['image'];
                    let url = wishlist[i]['url'];
                    let isbn = wishlist[i]['isbn'];
                    append_vercard_wish(url, image, isbn);
                }
            }
        }
    });
}

function add_wishlist() { //선택한 아이템을 위시리스트로 옮겨야한다. #11
    let url = $("#url-input-box").val();

    if (url == "") {
        alert("주소를 입력해주세요")
        $("#url-input-box").focus()
        return
    } else if (!url.includes("yes24.com")) {
        alert("지원하지 않는 사이트입니다")
    } else {
        $.ajax({
            type: "POST",
            url: "/addWishlist",
            data: {url: url},
            success: function (response) { // 성공하면
                if (response["result"] == "success") {
                    console.log(response["msg"])
                    $("#wish-info").html("");
                    my_wishlist()
                }
            }
        })
    }


}

function now_reading_books() { // 읽는 책을 조회한다.
    console.log('지금 읽는 책 조회 시작');

    $.ajax({
        type: "GET",
        url: "/viewMyReadBooks",
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("내 서재 조회 성공");
                let reading = response["mybooks"]
                for (let i = 0; i < reading.length; i++) {
                    let image = reading[i]['image'];
                    let isbn = reading[i]['isbn'];
                    let progress = reading[i]['progress'];

                    append_vercard(image, isbn, progress);
                }
            }
        }
    });
}

function my_books(query) { // 카테고리별 도서를 조회한다.
    console.log('내 서재 조회 시작');
    console.log("요청주소: /viewMybooks" + "?ct=" + query)

    $.ajax({
        type: "GET",
        url: "/viewMybooks" + "?ct=" + query,
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("내 서재 조회 성공");
                let book = response["mybooks"]
                $('#mybook-list').html("")
                for (let i = 0; i < book.length; i++) {
                    let title = book[i]['title'];
                    let url = book[i]['url'];
                    let author = book[i]['author'];
                    let isbn = book[i]['isbn'];
                    let status = book[i]['status'];
                    let progress = book[i]['progress'];
                    append_mybooks(i + 1, title, url, author, status, progress, isbn);
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
                console.log("왠지 모르지만 실패");
            $("#wish-info").html("");
            my_wishlist();
        }
    })
}

function buy_mybook(item) { //위시리스트에 넣어둔 책을 사려고한다.
    let item_isbn = item
    console.log("사려고 함:", item);

    $.ajax({
        type: "POST",
        url: "/buyMybook",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"]);
                $("#wish-info").html("");
                my_wishlist();
            }
        }
    })
}

function add_mybook() { //바로 책에 추가한다.
    if (url == "") {
        alert("주소를 입력해주세요")
        $("#url-input-box").focus()
        return
    } else if (!url.includes("yes24.com")) {
        alert("지원하지 않는 사이트입니다")
    } else {
        $.ajax({
            type: "POST",
            url: "/addMybook",
            data: {url: url},
            success: function (response) { // 성공하면
                if (response["result"] == "success") {
                    console.log(response["msg"])
                    window.location.reload();
                }
            }
        })
    }
}

function append_vercard(image, isbn, progress) {
    let vercard =
        `     <div class="reading-book-card">
                    <div class="progress">
                      <div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>
                    </div>
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" onclick="alert('${isbn}')">읽기</button>
                          <button type="button" class="text-button right" onclick="alert('${isbn}')">멈추기</button>
                          <button type="button" class="text-button right" onclick="alert('${isbn}')">완료</button>
                        </div>
                     </div>
                  </div>`
    $('#book-info').append(vercard);
    if (progress <25) {
        $('.progress-bar').css("color", "black")
    }

}

function append_vercard_wish(url, image, isbn) {
    let vercard =
        `     <div class="reading-book-card">
                    <img src="${image}" class="card-img-top">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" onclick="buy_mybook('${isbn}')">구입완료</button>
                          <button type="button" class="text-button right" onclick="remove_wishlist('${isbn}')">삭제하기</button>
                        </div>
                     </div>
                  </div>`
    $('#wish-info').append(vercard);
}

function append_mybooks(i, title, url, author, status, progress, isbn) {
    let tablerow =
        `<tr>
                    <th scope="row">${i}</th>
                    <td><a href="${url}">${title}</a></td>
                    <td>${author}</td>
                    <td>${progress}</td>
                    <td>${status}</td>
                    <td><button type="button" value="${isbn}" onclick="view_mybook_info('${isbn}')">업데이트</button></td>
        </tr>`
    $('#mybook-list').append(tablerow);
}

function view_mybook_info(isbn) {
    console.log("상세 개발시작---------", isbn)
    $.ajax({
        type: "GET",
        url: "/detailMybook" + "?isbn=" + isbn,
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("내 서재 조회 성공");
                let book_detail = response["mybook"]
                console.log('책정보', book_detail)
            }
        }
    });
    console.log("상세 개발끝---------", isbn)
}

function get_categories() { // 읽는 책을 조회한다.
    console.log('내서재 카테고리들 조회시작');

    $.ajax({
        type: "GET",
        url: "/getCategories",
        data: {},
        success: function (response) {
            console.log(response["msg"])
            let category = response["categories"]
            console.log(category)
            for (let i = 0; i < category.length; i++) {
                let name = category[i]['name'];
                let count = category[i]['count'];
                console.log(category[i], name, count)

                let listrow = `<li class="list-group-item d-flex justify-content-between align-items-center" onclick="my_books(encodeURI('${name}'))">
                                    ${name}
                                    <span class="badge badge-primary badge-pill">${count}</span>
                                </li>`
                $('#category-group').append(listrow);
            }
        }
    });
}

function clear_input_url() {
    $("#url-input-box").val("");
}