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


## API 역할을 하는 부분
@app.route('/book', methods=['POST'])
def paste_book():
    # 클립보드에 있는거 불러오기
    global ebook_price, ebook
    text = clipboard.paste()
    print(text)

    # 메타태그 스크랩핑하기
    url = clipboard.paste()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')
    # infoarea = soup.select('#yDetailTopWrap > div.topColRgt > div.gd_infoBot > div.gd_infoTbArea')

    og_image = soup.select_one('meta[property="og:image"]')['content']
    og_title = soup.select_one('meta[property="og:title"]')['content']
    og_description = soup.select_one('meta[property="og:description"]')['content']
    og_author = soup.select_one('meta[name="author"]')['content']
    isbn = soup.select_one('meta[property="books:isbn"]')['content']
    price = soup.select_one('.nor_price > em').text

    # 전자책 없는 케이스 처리
    ## yes24 는 책 정보내에 토글 버튼은 0~3개가 노출된다
    ## ebook이 있는 경우 토글 버튼 1번째에 ebook 이라고 표시된다.
    ## ebook이라는 텍스트가 포함된 토글일 경우, 전자책 가격을 꺼내온다.
    # divInfo = soup.find('#divFormatInfo')
    # if divInfo != None:
    #     ebook_price = soup.select_one('#divFormatInfo > ul > li > a > em').text


    print(og_image)
    print(og_title)
    print(og_description)
    print(og_author)
    print(price)
    print(isbn)
    # print(ebook_price)


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


@app.route('/book', methods=['GET'])
def read_bookmeta():
    # 1. mongoDB에서 _id 값을 제외한 모든 데이터 조회해오기(Read)
    all_memos = list(db.alonememo.find({}, {'_id': False}))

    # 2. articles라는 키 값으로 articles 정보 보내주기
    return jsonify({'result': 'success', 'memos': all_memos})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
