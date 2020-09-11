from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient  # pymongo를 임포트 하기(패키지 인스톨 먼저 해야겠죠?)
import requests  # 메타태그 스크래핑
from bs4 import BeautifulSoup
import clipboard  # 클립보드 가져오기

app = Flask(__name__)

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로 돌아갑니다.
db = client.dbsparta  # 'dbsparta'라는 이름의 db를 만들거나 사용합니다.


# ## 카트(메인페이지) web client
# @app.route('/')
# def home():
#     return render_template('index.html')
#
# ### 메인페이지 > 책 url 붙여넣기 (스크래핑 + 카트넣기) api
# @app.route('/addCart', methods=['POST'])
# def add_cart():
#     # 클립보드에 있는거 불러오기
#     url = clipboard.paste()
#     print("주소복사완료:", url)
#
#     # 메타태그 스크랩핑하기
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
#     data = requests.get(url, headers=headers)
#
#     soup = BeautifulSoup(data.text, 'html.parser')
#
#     og_image = soup.select_one('meta[property="og:image"]')['content']
#     og_title = soup.select_one('meta[property="og:title"]')['content']
#     og_author = soup.select_one('meta[name="author"]')['content']
#     og_description = soup.select_one('meta[property="og:description"]')['content']
#     price = soup.select_one('.nor_price > em').text
#     isbn = soup.select_one('meta[property="books:isbn"]')['content']
#
#     print('Yes24 도서상세 조회완료:')
#     print(og_image, og_title, og_author, og_description, price, isbn)
#
#     book = {
#         "url": url,
#         "image": og_image,
#         "title": og_title,
#         "author": og_author,
#         "desc": og_description,
#         "price": price,
#         "isbn": isbn
#     }
#     db.bookcart.insert_one(book)
#     return jsonify({'result': 'success', 'msg': '카트에 담기성공'})

### 내서재 조회 web client
@app.route('/')
def mybooks():
    return render_template('index.html')
# 내서재 추가
@app.route('/addMybook', methods=['POST'])
def addMybook():
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
        "isbn": isbn,
        "status": "BUY",
        "progress": "0"
    }

    sr = db.mybook.find_one({'isbn': isbn})
    if sr is None:
        db.mybook.insert_one(book)
        return jsonify({'result': 'success', 'msg': '내 서재 추가 성공'})
    else:
        return jsonify({'result': 'success', 'msg': '중복도서가 있습니다'})


# 위시리스트 추가 api
@app.route('/addWishlist', methods=['POST'])
def add_wishlist():
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

    sr = db.wishlist.find_one({'isbn': isbn})
    if sr is None:
        db.wishlist.insert_one(book)
        return jsonify({'result': 'success', 'msg': '위시리스트 추가 성공'})
    else:
        return jsonify({'result': 'success', 'msg': '중복도서가 있습니다'})

### 위시리스트 조회 api
@app.route('/viewWishlist', methods=['GET'])
def read_bookmeta():
    all_wishlist = list(db.wishlist.find({}, {'_id': False}))
    print('모든아이템: ', db.wishlist.find({}, {'_id': False}))

    return jsonify({'result': 'success', 'msg': '위시리스트 전체 조회완료', 'wishbooks': all_wishlist})

### 위시리스트 제거 api
@app.route('/removeWishlist', methods=['POST'])
def remove_wishlist():
    isbn_receive = request.form['isbn']
    print("제거할 도서 : ", isbn_receive)
    db.wishlist.delete_one({'isbn': isbn_receive})

    health_check = db.wishlist.find_one({'isbn': isbn_receive})
    if health_check is not None:
        return jsonify({'result': 'success', 'msg': '위시리스트에서 제거실패'})
    else:
        return jsonify({'result': 'success', 'msg': '위시리스트에서 제거완료'})

## =============================================
@app.route('/buyMybook', methods=['POST'])
def buy_mybook():
    isbn_receive = request.form['isbn']
    print("위시리스트에서 사려고 함:", isbn_receive)
    # wish 리스트의 상태를 업데이트하고, 책정보를 받아 소장상태로 변경한다.
    # 위시리스트에서 소장하는 경우 : 위시리스트에서 제거, 소장도서 목록에 추가
    wishbook = db.wishlist.find_one({"isbn": isbn_receive})
    mybook = db.mybook.find_one({"isbn": isbn_receive})

    if mybook is not None: #내 서재에 이미 있으면
        db.wishlist.delete_one({'isbn': isbn_receive})  # 위시에서 삭제
        return jsonify({'result': 'success', 'msg': '소장도서'})
    else: #내 서재에 없으면 구입가능
        if wishbook is not None: #위시리스트에 있으면
            db.mybook.insert_one(wishbook)  # 서제에 추가
            db.wishlist.delete_one({'isbn': isbn_receive})  # 위시에서 삭제
            return jsonify({'result': 'success', 'msg': '도서구매 완료'})
        else:
            return jsonify({'result': 'success', 'msg': '위시리스트에 존재하지 않음'})



### 내 서재 조회
@app.route('/viewMybooks', methods=['GET'])
def read_mybook_meta():
    all_mybook = list(db.mybook.find({}, {'_id': False}))
    print('모든아이템: ', db.mybook.find({}, {'_id': False}))

    return jsonify({'result': 'success', 'msg': '내 도서 전체 조회완료', 'mybooks': all_mybook})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)


### 테스트코드
# 조건문 db.wishlist.find_one({"$or": [{'isbn': isbn_receive}, {'title': title_receive}]}, {'_id': False})
# 업데이트 db.wishlist.update_many({'isbn': isbn_receive}, {'$set': {'deleted': True}})