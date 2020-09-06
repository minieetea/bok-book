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
@app.route('/pastebook', methods=['POST'])
def paste_book():
    # 클립보드에 있는거 불러오기
    text = clipboard.paste()
    print(text)

    # 메타태그 스크랩핑하기
    url = clipboard.paste()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')['content']
    og_title = soup.select_one('meta[property="og:title"]')['content']
    og_description = soup.select_one('meta[property="og:description"]')['content']
    og_author = soup.select_one('meta[name="author"]')['content']
    isbn = soup.select_one('meta[property="books:isbn"]')['content']
    price = soup.select_one('.nor_price > em').text

    print('Yes24 조회완료===========')
    print(og_image, og_title, og_author, og_description, price, isbn)


    bookinfo = {
        'url': url,
        'title': og_title,
        'image': og_image,
        'desc': og_description,
        'author': og_author,
        'price': price,
        'isbn': isbn
    }
    return jsonify({'result': 'success', 'msg': '성공ㅆ~', 'bookinfo': bookinfo})


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
    print("위시리스트 조회완료=======================")
    print(url_receive, title_receive, image_receive, desc_receive, author_receive, price_receive, isbn_receive)

    #2. 디비 조회해보기
    # temp = list(db.wishlist.find({}, {'_id': False}))
    # print(temp)

    isbnbooks = db.wishlist.find_one({'isbn': isbn_receive}, {'_id': False})
    titlebooks = db.wishlist.find_one({'title': title_receive}, {'_id': False})
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
    if isbnbooks is not None:
        return jsonify({'result': 'success', 'msg': 'isbn 중복도서가 있습니다.', 'body': isbnbooks})
    elif titlebooks is not None:
        return jsonify({'result': 'success', 'msg': '타이틀 중복도서가 있습니다.', 'body': titlebooks})
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

    print(db.wishlist.find({}, {'_id': False}))

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


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)



