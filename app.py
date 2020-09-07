from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 인스톨 먼저 해야겠죠?)
import requests  # 메타태그 스크래핑
from bs4 import BeautifulSoup
import clipboard  # 클립보드 가져오기

app = Flask(__name__)

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 만들거나 사용합니다.


## 메인페이지
@app.route('/')
def home():
    return render_template('index.html')

## 메인페이지 책 스크랩핑 API 역할을 하는 부분
@app.route('/addCart', methods=['POST'])
def add_cart():
    # 클립보드에 있는거 불러오기
    url = clipboard.paste()
    print("주소복사완료:", url)

    # 메타태그 스크랩핑하기
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')['content']
    og_title = soup.select_one('meta[property="og:title"]')['content']
    og_author = soup.select_one('meta[name="author"]')['content']
    og_description = soup.select_one('meta[property="og:description"]')['content']
    price = soup.select_one('.nor_price > em').text
    isbn = soup.select_one('meta[property="books:isbn"]')['content']

    print('Yes24 도서상세 조회완료:')
    print(og_image, og_title, og_author, og_description, price, isbn)

    book = {
        "url": url,
        "image": og_image,
        "title": og_title,
        "author": og_author,
        "desc": og_description,
        "price": price,
        "isbn": isbn
    }
    db.bookcart.insert_one(book)
    return jsonify({'result': 'success', 'msg': '카트에 담기성공'})

@app.route('/viewCart', methods=['GET'])
def view_cart():

    all_bookcart = list(db.bookcart.find({}, {'_id': False}))

    print('모든아이템 개수:', len(all_bookcart))
    print('모든아이템: ', db.bookcart.find({}, {'_id': False}))


    if all_bookcart is None:
        return jsonify({'result': 'success', 'msg': '카트아이템 없음'})
    else: # 2. articles라는 키 값으로 articles 정보 보내주기
        return jsonify({'result': 'success', 'msg': '카트 조회 API 응답', 'bookcart': all_bookcart})


## 책을 임시로 담아두는 카트를 비우기
@app.route('/clearCart', methods=['POST'])
def create_bookcart():
    db.bookcart.delete_many({})
    return jsonify({'result': 'success', 'msg': '카트에 비우기 성공'})



## 위시리스트 추가 api
@app.route('/addWishlist', methods=['POST'])
def post_wishlist():
    #1. 책 정보 받아오기

    url_receive = request.form['url']
    title_receive = request.form['title']
    image_receive = request.form['image']
    desc_receive = request.form['desc']
    author_receive = request.form['author']
    price_receive = request.form['price']
    isbn_receive = request.form['isbn']
    print(title_receive, isbn_receive)

    #2. 디비 조회해보기
    testbooks = db.wishlist.find_one({"$or": [{'isbn': isbn_receive}, {'title': title_receive}]}, {'_id': False})
    print('테스트:', testbooks)

    wishbook = {
        'title': title_receive,
        'image': image_receive,
        'desc': desc_receive,
        'author': author_receive,
        'price': price_receive,
        'isbn': isbn_receive,
        'url': url_receive,
        'status': 'WISH',
        'deleted': False
    }

    # 3. isbn 또는 title 중복된 거 없으면 넣기
    if testbooks is not None:
        return jsonify({'result': 'success', 'msg': '즐겨찾기에 중복도서가 있습니다.', 'books': testbooks})
    else:
        db.wishlist.insert_one(wishbook)
        return jsonify({'result': 'success', 'msg': '즐겨찾기 추가했습니다'})

@app.route('/wishlist')
def wishlist():
    return render_template('wishlist.html')

@app.route('/getWishlist', methods=['GET'])
def read_bookmeta():
    # 1. mongoDB에서 _id 값을 제외한 모든 데이터 조회해오기(Read)
    all_wishlist = list(db.wishlist.find({'deleted': False}, {'_id': False}))

    print('모든아이템: ', db.wishlist.find({}, {'_id': False}))

    # 2. articles라는 키 값으로 articles 정보 보내주기
    return jsonify({'result': 'success', 'msg': '불러왔습니다', 'wishbooks': all_wishlist})

@app.route('/removeWishlist', methods=['POST'])
def remove_wishlist():
    # 1. 데이터찾기
    isbn_receive = request.form['isbn']
    print(isbn_receive)

    db.wishlist.update_many({'isbn': isbn_receive}, {'$set': {'deleted': True}})
    result = db.wishlist.find_one({'isbn': isbn_receive})
    print(result)

    # 2. articles라는 키 값으로 articles 정보 보내주기
    return jsonify({'result': 'success', 'msg': '삭제함'})

@app.route('/isMybook', methods=['GET'])
def is_mybook():
    #1. 책 구매이력 조회해본다.
    isbn_receive = request.form['isbn']
    title_receive = request.form['title']
    # isbnbooks = db.wishlist.find_one({'isbn': isbn_receive}, {'_id': False})
    # titlebooks = db.wishlist.find_one({'title': title_receive}, {'_id': False})
    # db.wishlist.find({ $or: [ { 'isbn': isbn_receive }, { 'title': title_receive } ] })
    # book_condition = {
    #     'pay_type': isbnbooks.isbn
    #     'status':isbnbooks
    # }

    if isbnbooks is not None:
        return jsonify({'result': 'success', 'msg': 'isbn 중복도서가 있습니다.', 'body': isbnbooks})
    elif titlebooks is not None:
        return jsonify({'result': 'success', 'msg': '타이틀 중복도서가 있습니다.', 'body': titlebooks})
    else:
        return jsonify({'result': 'success', 'msg': '구매이력이 없습니다.'})

@app.route('/addMybook', methods=['GET'])
def check_mybook():
    # let isbn
    book_condition = {
        # 'isbn':
        # 'pay_type':
        # 'status':
    }

    return jsonify({'result': 'success', 'msg': '도서목록에 있음', 'condition': book_condition})


@app.route('/addMybook', methods=['POST'])
def add_mybook():

    #책 메타정보로부터 가져온 기본정보
    url_receive = request.form['url']
    image_receive = request.form['image']
    desc_receive = request.form['desc']
    author_receive = request.form['author']
    price_receive = request.form['price']

    #키값
    isbn_receive = request.form['isbn']
    title_receive = request.form['title']

    #사용자로부터 입력받은 정보
    book_type_receive = request.form['book_type'] #hardcover, digital
    pay_type_receive = request.form['pay_type'] #bok, cash, rent
    buy_store_type_receive = request.form['store_type'] #online, offline
    buy_store_receive = request.form['buy_store'] #yes24, kyobo, ridibooks
    buy_date_receive = request.form['date'] #yyyy-mm-dd

    # status = hold

    #
    # 위시리스트에 같은 책이 있으면 제거한다.
    return jsonify({'result': 'success', 'msg': '도서를 샀음!'})

# @app.route('/deleteMybook', methods=['POST'])


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)



