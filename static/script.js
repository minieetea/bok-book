//////////////////////////////////////////////////////
//공통
function isbn_url_parser() {
    const parsedUrl = new URL(window.location.href);
    console.log(parsedUrl.searchParams.get("isbn")); // "123"
    const parsedIsbn = parsedUrl.searchParams.get("isbn");
    return parsedIsbn;
}

//도서상세, 읽고있는 책 - 진척률 변경
function update_progress(isbn) {
    console.log("진척률 변경하기", isbn)
    $.ajax({
        type: "POST",
        url: "/updateProgress",
        data: {isbn: isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    });
    view_details();
}

//////////////////////////////////////////////////////
//입력창 - 바로구매하기
function add_mybook() { //바로 책에 추가한다.
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
            url: "/addMybook",
            data: {url: url},
            success: function (response) { // 성공하면
                if (response["result"] == "success") {
                    $('.toast').toast('show')
                    $('.toast-body').text(response["msg"])
                }
            }
        });
    }
    window.location.reload();
}

//입력창 - 지우기
function clear_input_url() {
    $("#url-input-box").val("");
}

//////////////////////////////////////////////////////
//지금 읽고있는 책
function now_reading_books() {
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


function append_vercard(image, isbn, progress) {
    let vercard =
        `     <div class="reading-book-card">
                    <div class="progress">
                      <div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>
                    </div>
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" onclick="update_progress('${isbn}')">읽기</button>
                          <button type="button" class="text-button right" onclick="update_status('${isbn}', 'STOP')">멈추기</button>
                          <button type="button" class="text-button right" onclick="update_status('${isbn}', 'STOP')">완료</button>
                        </div>
                     </div>
                  </div>`
    $('#book-info').append(vercard);
    // if (progress > 15) {
    //     $('.progress-bar').css("color", "white")
    // }

}

//////////////////////////////////////////////////////
//위시리스트
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
    } else if (!url.includes("www.yes24.com")) {
        alert("지원하지 않는 사이트입니다")
    } else {
        $.ajax({
            type: "POST",
            url: "/addWishlist",
            data: {url: url},
            success: function (response) { // 성공하면
                if (response["result"] == "success") {
                    $('.toast').toast('show')
                    $('.toast-body').text(response["msg"])
                    $("#wish-info").html("");
                    my_wishlist()
                }
            }
        })
    }


}

function remove_wishlist(item) { //위시리스트를 제거한다. (개선필요)
    let item_isbn = item
    console.log("제거하려고 함:", item)
    $.ajax({
        type: "POST",
        url: "/removeWishlist",
        data: {isbn: item_isbn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log("위시리스트 아이템 삭제 성공");
                my_wishlist();
            }
            else
                console.log("왠지 모르지만 실패");
        }
    })
    window.location.reload();

}

function buy_mybook(item, bokYN) { //위시리스트에 넣어둔 책을 사려고한다.
    let item_isbn = item
    let item_bok_yn = bokYN
    console.log("사려고 함:", item, bokYN);

    $.ajax({
        type: "POST",
        url: "/buyMybook",
        data: {isbn: item_isbn, bokYN: item_bok_yn},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                console.log(response["msg"]);
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    })

    window.location.reload();
}

function append_vercard_wish(url, image, isbn) {
    let vercard =
        `     <div class="reading-book-card">
                    <img src="${image}" class="card-img-top">
                    <div class="card-footer">
                      <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
                          <button type="button" class="text-button left" data-toggle="modal" data-target="#bokbookModal" data-whatever="${isbn}">구입완료</button>
                          <button type="button" class="text-button right" onclick="remove_wishlist('${isbn}')">삭제하기</button>
                        </div>
                     </div>
                  </div>`
    $('#wish-info').append(vercard);
}

//////////////////////////////////////////////////////
//소장도서 - 카테고리

function get_categories() {
    console.log('내서재 카테고리들 조회시작');
    $('#category-group').html("");

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
            let alpharow = `<li class="list-group-item d-flex justify-content-between align-items-center" data-toggle="modal" data-target="#categoryModal">카테고리 추가<i class="fas fa-plus"></i></li>`
            $('#category-group').append(alpharow);

        }
    });
}

// 소장도서 - 카테고리별 도서 조회
function my_books(query) {
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
                    let isbn = book[i]['isbn'];
                    let status = book[i]['status'];
                    let bokYN = book[i]['bokYN'];
                    append_mybooks(i + 1, title, url, status, bokYN, isbn);
                }
            }
        }
    });
}

//카테고리 - 추가
function add_category(name) {
    console.log("카테고리 추가 api 호출")
    $.ajax({
        type: "POST",
        url: "/addCategory",
        data: {
            name: name
        },
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    });
    window.location.reload();
}

//도서목록 - 자세히보기
function open_details(isbn) {
    window.open('../details?isbn=' + isbn, '_blank');
}

function append_mybooks(i, title, url, status, bokYN, isbn) {

    if (bokYN == "true") {
        console.log("응응")
        let tablerow =
            `<tr>
                    <th scope="row">${i}</th>
                    <td><a href="${url}">${title}</a></td>
                    <td>${status}</td>
                    <td><span class="badge badge-info" id="bokYN-badge">복카드구매</span></td>
                    <td><button type="button" value="${isbn}" onclick="open_details('${isbn}')">독서노트</button></td>
        </tr>`
        $('#mybook-list').append(tablerow);
    } else {
        let tablerow =
            `<tr>
                    <th scope="row">${i}</th>
                    <td><a href="${url}">${title}</a></td>
                    <td>${status}</td>
                    <td><span class="badge badge-secondary" id="bokYN-badge">직접구매</span></td>
                    <td><button type="button" value="${isbn}" onclick="open_details('${isbn}')">독서노트</button></td>
        </tr>`
        $('#mybook-list').append(tablerow);
    }
}


//////////////////////////////////////////////////////
//도서상세 - 정보 조회

function view_details() {
    const parsedIsbn = isbn_url_parser();

    $.ajax({
        type: "GET",
        url: "/myBookDetails" + "?isbn=" + parsedIsbn,
        data: {},
        success: function (response) {
            console.log(response["msg"])
            if (response["result"] == "success") {
                console.log("내 서재 조회 성공");
                let book_detail = response["details"]
                let title = book_detail['title']
                let desc = book_detail['desc']
                let price = book_detail['price']
                let isbn = book_detail['isbn']
                let image = book_detail['image']
                let author = book_detail['author']
                let category = book_detail['category']
                let status = book_detail['status']
                let progress = book_detail['progress']
                let bokYN = book_detail['bokYN']
                console.log(title)
                console.log('책정보', book_detail)
                $('#book-title').text(title)
                $('#book-cover').attr("src", image);
                $('#book-desc').text(desc)
                $('#book-price').text(price + "원")
                $('#book-author').text(author)
                $('#book-isbn').val(isbn)
                $('#book-category').text(category)
                $('#status-category').text(status)
                $('#book-progress').text(progress + "%")
                console.log(bokYN)
                if (bokYN == "false") {
                    console.log(bokYN)
                    $('#book-bok-icon').css("display", "none")
                }

            }
        }
    });
}

//도서상세 - 상태 변경
function update_status(isbn, status) {

    console.log("상태변경하기", isbn, status)
    $.ajax({
        type: "POST",
        url: "/updateStatus",
        data: {isbn: isbn, status: status},
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    });
    $('#status-category').text(status)
}



//도서상세 - 카테고리 목록조회
function make_category_list() {
    console.log('내서재 카테고리들 조회시작');
    $('#dropdown-category-list').html("");

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

                let listrow = `<a class="dropdown-item ct-item" onclick="update_category('${name}')">${name}</a>`
                $('#dropdown-category-list').append(listrow);
            }
        }
    });
}

//도서상세 - 카테고리 변경
function update_category(name) {
    const parsedIsbn = isbn_url_parser();
    console.log("카테고리 변경 api 호출", parsedIsbn, name)
    $.ajax({
        type: "POST",
        url: "/updateCategory",
        data: {
            isbn: parsedIsbn,
            name: name
        },
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    });
    $('#book-category').text(name);
}

//도서상세 - 독서노트 조회
function view_notes() {
    const parsedIsbn = isbn_url_parser();

    console.log("노트불러오기=======")
    $.ajax({
        type: "GET",
        url: "/viewNotes" + "?isbn=" + parsedIsbn,
        data: {},
        success: function (response) {
            console.log(response["msg"])
            let notes = response["notes"]
            console.log(notes)
            console.log(notes[0])
            for (let i = 0; i < notes.length; i++) {
                let note_message = notes[i]['message'];
                let note_ref = notes[i]['reference'];

                let cardnote = `<div class="card">
                            <div class="card-body">
                                <p class="card-text">${note_message}</p>
                                <p class="card-text"><small class="text-muted">${note_ref}</small></p>
                            </div>
                        </div>`
                $('#note-list').append(cardnote);
                // }
            }
        }
    });
    console.log("노트불러오기 끗=======")
}

//도서상세 - 독서노트 추가
function add_note(parsedIsbn, noteMessage, noteRef) {
    $.ajax({
        type: "POST",
        url: "/addNote",
        data: {
            isbn: parsedIsbn,
            note_message: noteMessage,
            note_ref: noteRef
        },
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                $('.toast').toast('show')
                $('.toast-body').text(response["msg"])
            }
        }
    });

}

