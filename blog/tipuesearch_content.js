var tipuesearch = {"pages":[{"url":"./pages/about/","tags":"misc","title":"About","text":"2016Fall 修課成員網誌"},{"url":"./dan-xian-xuan-zhuan-dong-hua.html","tags":"Course","title":"單線旋轉動畫","text":"單線旋轉動畫: window.onload=function(){ brython(1); } from browser import document from browser import window from browser import timer import math canvas = document[\"onebar\"] ctx = canvas.getContext(\"2d\") # 取畫布的寬與高度 width = canvas.width height = canvas.height # 畫圓函式 def circle(x,y,r): ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) ctx.fill() ctx.closePath() def line (x1,y1,x2,y2): # 以下可以利用 ctx 物件進行畫圖 # 先畫一條直線 ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() line(200,200,200,300) circle(200, 200, 5) x1 = 200 y1 = 200 r = 100 deg = math.pi/180 theta = 0 #每隔特定時間,進行動畫繪製 def animate(): global theta #刷新畫布 ctx.clearRect(0,0,width,height) #逐一重新繪製直線與圓心球 x2 = x1 + r*math.cos(theta*deg) y2 = y1 + r*math.sin(theta*deg) line(x1,y1,x2,y2) circle(x1,y1,5) theta += 1 timer.set_interval(animate,50) ''' for i in range(36): theta = i*10 x2 = x1 + r*math.cos(theta*deg) y2 = y1 + r*math.sin(theta*deg) line(x1,y1,x2,y2) ''' 上述繪圖的程式碼如下: window.onload=function(){ brython(1); } from browser import document from browser import window from browser import timer import math canvas = document[\"onebar\"] ctx = canvas.getContext(\"2d\") # 畫圓函式 def circle(x,y,r): ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) ctx.fill() ctx.closePath() def line (x1,y1,x2,y2): # 以下可以利用 ctx 物件進行畫圖 # 先畫一條直線 ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() line(200,200,200,300) circle(200, 200, 5) x1 = 200 y1 = 200 r = 100 deg = math.pi/180 x2 = x1 + r*math.cos(30*deg) y2 = y1 + r*math.sin(30*deg) line(x1,y1,x2,y2)"},{"url":"./chan-sheng-luan-shu-xin-de.html","tags":"Course","title":"產生亂數心得","text":"亂數是程式語言學習上的一個重點，學校的程式課程多半會教、出練習題， 因此也是新手常遇到的問題。 在此列出一點C語言中亂數使用上的心得以及常犯錯誤 == [1] 入門用法 srand( time(NULL) ); for( i = 0; i < 10; i++ ) printf( \"Random number #%d: %d\\n\", i, rand() ); 呼叫 srand()函式將亂數初始化，可以 time(NULL) 作為初始種子(seed)， 或自行設定任意數。不先呼叫本函數、或種子值固定，都會造成新手常見 的「每次執行產生的亂數結果都相同」問題。 == [2] 產生固定範圍的亂數 0 ~ n-1 一般常見的寫法有： rand() % n; (int)( n * ( rand() / (float)(RAND_MAX+1) ) ); 兩種寫法n的上限皆不能大於RAND_MAX，否則某些範圍內的數字永遠不會出現。(Why?) 一般C語言的RAND_MAX只有32767，於使用上需特別注意。 第1種寫法在n有點大時( RAND_MAX/k < n <=RAND_MAX, say k < 5 )可能會出現 亂數分佈不均。因此以第2種為佳。 a ~ b 將上面的寫法改一下，變成 a + ( 0 ~ (b-a+1) - 1 )即可。 也就是上面的 n 變成 b-a+1。 == [3] 產生更大範圍的整數亂數 使用系統內建的rand()上限一般只到 32767，使用上不方便，會有前述的問題。 改善方法有很多，這邊列出一種 RAND_MAX = 32767 時的簡單改寫法： int rand31() { // RAND31_MAX = 2147483647 return ( (rand() << 16) + (rand() << 1) + (rand() & 1) ); } unsigned int rand32() { // RAND32_MAX = 4294967295 return ( (rand() << 17) + (rand() << 2) + (rand() & 3) ); } 分別可產生32位元的有號及無號正整數亂數。 == [4] 產生 0 到 小於1 的浮點數 上面的例子用到的 rand() / (float)(RAND_MAX+1) 即可產生0~小於1的浮點數，但是如上所述，應用範圍只能到RAND_MAX。 RAND_MAX=32767簡單的改寫法如下，應用範圍提高到 16777215，是32位元浮點數極限： float rand24() { // RAND24_MAX = 16777215 return ( (rand() << 9) + (rand() >> 6) ) / (float)0x01000000; } [例] 產生在選定範圍均勻分佈的浮點亂數 產生 0 ~ 7777777的整數亂數： n = (int)( 7777778 * rand24() ) 產生 -2.5 ~ 2.5 的浮點亂數： x = ( rand24() - 0.5 ) * 5 產生 a ~ b 的浮點亂數： x = rand24() * ( b - a ) + a == [5] 產生特殊分佈的亂數 這邊我們以 frand()函數 表示 範圍為0~小於1的浮點數 uniform random number frand() 可以是上例的rand24() 或其他方式得到的亂數 高斯分佈(常態分佈)亂數 http://en.wikipedia.org/wiki/Normal_distribution *產生平均值μ=0 標準差平方σ&#94;2=1 的分佈 1 2 3 4 5 6 Gaussian0_rand = sqrt( -2 * log( frand() ) ) * sin( 2 * PI * frand() ) 使用2次frand()亂數產生高斯亂數。需要注意的是當第1個 frand() = 0 時， 會出現log(0)的數學錯誤，因此在使用上需做修正。可以用if來判斷，或是 將 log( frand() ) 改寫成 log( frand() + min_float ) min_float 是指 32bits 或 64bits 浮點數中最小的正浮點數。 *產生平均值μ 標準差σ的分佈 1 Gaussian_rand = Gaussian0_rand * σ + μ == 其他分佈 如果要做出特殊形狀分佈的亂數，只要那個形狀你有辦法積分，「大概」就可以 「簡單」的從 uniform rand# 轉成該函數的形狀 │f(x) p b │ ◢◣ ∫ f(x)dx = frand() * ∫ f(x)dx │ ◢◣◢██◣ a a │ ◢██████◣ ├──────────> 解方程式得到 p = g( frand() ) a p b p就是新的亂數，其分佈應該是如你所願。 [例] f(x) = C ， 從a積到b。 解： p = frand() * (b-a) + a (是否似曾相識！！) [例] f(x) = x ， 從a積到b。 解： p = sqrt( frand() * (b&#94;2 - a&#94;2) + a&#94;2 ) == 以上的簡單介紹相信在一般作業上的使用已經足夠。 由於內建的亂數是偽亂數，可預測性高， 萬萬別使用在對於安全性或隨機性要求很高的商業行為或是學術研究 有需求的人再自行去研究吧 http://en.wikipedia.org/wiki/Random_number_generation 另外，RAND_MAX的值隨著編譯器的種類會有很大差別，使用上述擴大亂數範圍 的簡單函數時記得先確認自己RAND_MAX的值再加以改寫，以免出現不明錯誤...."},{"url":"./xin-nian-kuai-le.html","tags":"Course","title":"新年快樂","text":"window.onload=function(){ brython(1); } from browser import document from browser import html import random print_location = document[\"newyear\"] def gen_int(): num = random.randint(1,49) #設法將num列印在網頁上 #print_location = document[\"newyear\"] print_location <= num+html.BR() def lottery(e): for i in range (6): gen_int() print_location <=\"恭喜中獎!!\"+html.BR() #document[\"but1\"].bind(\"click\",gen_int) document[\"but1\"].bind(\"click\",lottery) 產生整數亂數 from browser import document from browser import html import random print_location = document[\"newyear\"] def gen_int(): num = random.randint(1, 49) # 設法將 num 列印在網頁上 #print_location = document[\"newyear\"] print_location <= num + html.BR() def lottery(e): for i in range(6): gen_int() print_location <= \"恭喜中獎!\" + html.BR() #document[\"but1\"].bind(\"click\", gen_int) document[\"but1\"].bind(\"click\", lottery) 產生整數亂數 因為上述程式可能會產生相同的號碼, 改用 random.sample() , 使其產生六個不同的整數!! from browser import document from browser import html import random print_location = document[\"newyear\"] def lottery(e): num_list = random.sample(list(range(1, 50)), 6) for i in range(6): print_location <= num_list[i] + html.BR() print_location <= \"恭喜中獎!\" + html.BR() document[\"but2\"].bind(\"click\", lottery) 恭喜中獎 from browser import document from browser import html import random print_location = document[\"newyear\"] def lottery(e): num_list = random.sample(list(range(1, 50)), 6) for i in range(6): print_location <= num_list[i] + html.BR() print_location <= \"恭喜中獎!\" + html.BR() document[\"but2\"].bind(\"click\", lottery) 恭喜中獎"},{"url":"./ye-dan-kuai-le.html","tags":"Course","title":"耶誕快樂","text":"耶誕快樂 window.onload=function(){ brython(1); } from browser import document as do from browser import html c = do[\"con\"] def compa(e): your_input = input(\"請輸入一個整數!\") # 如何判斷所輸入的整數比 10 大 try: if int(your_input) > 10: c <= \"所輸入的整數:\" + your_input + \"比 10 大\" + html.BR() else: c <= \"所輸入的整數:\" + your_input + \"比 10 小\" + html.BR() except: c <= \"請輸入整數!!\" + html.BR() #print(\"test\") ''' for i in range(5): c <= \"test\" + html.BR() ''' do[\"b1\"].bind(\"click\", compa) compa from browser import document as do from browser import html c = do[\"con\"] def compa(e): your_input = input(\"請輸入一個整數!\") # 如何判斷所輸入的整數比 10 大 try: if int(your_input) > 10: c <= \"所輸入的整數:\" + your_input + \"比 10 大\" + html.BR() else: c <= \"所輸入的整數:\" + your_input + \"比 10 小\" + html.BR() except: c <= \"請輸入整數!!\" + html.BR() #print(\"test\") ''' for i in range(5): c <= \"test\" + html.BR() ''' do[\"b1\"].bind(\"click\", compa) compa"},{"url":"./w14.html","tags":"Course","title":"W14","text":"以下為 http://mde.tw/2016fallcp/course/Python3Programs.txt 中的 ch01 綜合範例, 其餘範例位於本 Leo Editor 專案檔中的 \"Python3 程式範例\" 節點, 請各組一一將範例程式碼與執行結果, 放入各學員的課程網誌中. 本課程 W15 - W18 週將利用 introduction_to_prog_python3_2012.pdf 與 python_for_everybody_2015.pdf 中有關物件導向的說明, 並且配合 https://github.com/mdecourse/webgame 倉儲中的 Leo Editor 專案, 希望各組能夠了解利用 Python3 與 Brython 語法處理 靜態圖檔 、 動態圖檔 與 網際遊戲 的運作原理, 順利完成各組的期末報告. window.onload=function(){ brython(1); } from browser import document from browser import alert ''' # 利用 input() 取得使用者輸入, 然後進行資料處理或運算後, 列出結果 #01-01.py print (\"Hello World!\") #01-02.py thetext = input(\"Enter some text \") print (\"This is what you entered:\") print (thetext) #01-03.py # Note that \\n within quote marks forces a new line to be printed thetext = input(\"Enter some text\\n\") print (\"This is what you entered:\") print (thetext) #01-04.py prompt = \"Enter a some text \" thetext = input(prompt) print (\"This is what you entered:\") print (thetext) ''' def get_input(ev): the_input= input(\"請輸入\") alert(\"輸入為:\"+str(the_input)) document['ch01'].bind('click',get_input) 取輸入後, 列印出來 from browser import document from browser import alert def get_input(ev): the_input= input(\"請輸入\") alert(\"輸入為:\"+str(the_input)) document['ch01'].bind('click',get_input) 取輸入後, 列印出來 from browser import document as doc from browser import html container = doc['container'] def numPrint(ev): mystring = \"\" num = input(\"請輸入重複執行次數:\") #for i in range(1, 11): for i in range(1, int(num)+1): mystring += str(i) + \": hello mde\" + html.BR() container <= mystring doc['w13'].bind('click',numPrint) 取重複執行次數後, 列印出來 from browser import document as doc from browser import html # 利用 document 根據 div 標註 id 設為 container 變數 container = doc['container'] # 因為此函式與滑鼠互動, 需要 event 當作輸入 def numPrint(ev): mystring = \"\" num = input(\"請輸入重複執行次數:\") #for i in range(1, 11): for i in range(1, int(num)+1): mystring += str(i) + \": hello mde\" + html.BR() container <= mystring # 與 id 為 'w13' 對應的 button 綁定, 且滑鼠 click 後, 呼叫 numPrint 函式執行 doc['w13'].bind('click',numPrint) 取重複執行次數後, 列印出來 開始進行範例分類: 接受使用者輸入, 然後利用 int() 或 str() 或 float() 函式轉為題目所需的資料型別 input() 取回的資料為字串, 經過 int() 可以轉為整數 若 num 變數內容為整數, 經過 str() 可以轉為字串, 然後再與其他字串進行結合後列印 練習: 編寫一個可以將使用者輸入的攝氏溫度, 轉為華氏溫度. from browser import document as doc from browser import html # 利用 document 根據 div 標註 id 設為 container 變數 container = doc['temperature'] # 因為此函式與滑鼠互動, 需要 event 當作輸入 def convTemp(event): mystring = \"\" cdegree = input(\"請輸入攝氏溫度:\") fdegree = float(cdegree)*9/5 + 32 output_string = \"攝氏 \" + str(cdegree) + \"度=華氏 \" + str(fdegree) + \"度\" + html.BR() container <= output_string # 與 id 為 'w13-1' 對應的 button 綁定, 且滑鼠 click 後, 呼叫 convTemp 函式執行 doc['w13-1'].bind('click',convTemp) 取攝氏溫度, 轉為華氏溫度 from browser import document as doc from browser import html # 利用 document 根據 div 標註 id 設為 container 變數 container = doc['temperature'] # 因為此函式與滑鼠互動, 需要 event 當作輸入 def convTemp(event): mystring = \"\" cdegree = input(\"請輸入攝氏溫度:\") fdegree = float(cdegree)*9/5 + 32 output_string = \"攝氏 \" + str(cdegree) + \"度=華氏 \" + str(fdegree) + \"度\" + html.BR() container <= output_string # 與 id 為 'w13-1' 對應的 button 綁定, 且滑鼠 click 後, 呼叫 convTemp 函式執行 doc['w13-1'].bind('click',convTemp) 取攝氏溫度, 轉為華氏溫度 import sys import time import traceback import javascript from browser import document as doc, window, alert has_ace = True try: editor = window.ace.edit(\"editor\") session = editor.getSession() session.setMode(\"ace/mode/python\") editor.setOptions({ 'enableLiveAutocompletion': True, 'enableSnippets': True, 'highlightActiveLine': False, 'highlightSelectedWord': True }) except: from browser import html editor = html.TEXTAREA(rows=20, cols=70) doc[\"editor\"] <= editor def get_value(): return editor.value def set_value(x):editor.value = x editor.getValue = get_value editor.setValue = set_value has_ace = False if hasattr(window, 'localStorage'): from browser.local_storage import storage else: storage = None def reset_src(): if storage is not None and \"py_src\" in storage: editor.setValue(storage[\"py_src\"]) else: editor.setValue('for i in range(10):\\n\\tprint(i)') editor.scrollToRow(0) editor.gotoLine(0) def reset_src_area(): if storage and \"py_src\" in storage: editor.value = storage[\"py_src\"] else: editor.value = 'for i in range(10):\\n\\tprint(i)' class cOutput: def __init__(self,target): self.target = doc[target] def write(self,data): self.target.value += str(data) #if \"console\" in doc: sys.stdout = cOutput(\"console\") sys.stderr = cOutput(\"console\") def to_str(xx): return str(xx) info = sys.implementation.version doc['version'].text = 'Brython %s.%s.%s' % (info.major, info.minor, info.micro) output = '' def show_console(ev): doc[\"console\"].value = output doc[\"console\"].cols = 60 doc[\"console\"].rows = 10 # load a Python script def load_script(evt): _name = evt.target.value + '?foo=%s' % time.time() editor.setValue(open(_name).read()) # run a script, in global namespace if in_globals is True def run(*args): global output doc[\"console\"].value = '' src = editor.getValue() if storage is not None: storage[\"py_src\"] = src t0 = time.perf_counter() try: #ns = {'__name__':'__main__'} ns = {'__name__':'editor'} exec(src, ns) state = 1 except Exception as exc: traceback.print_exc(file=sys.stderr) state = 0 output = doc[\"console\"].value print('<completed in %6.2f ms>' % ((time.perf_counter() - t0) * 1000.0)) return state if has_ace: reset_src() else: reset_src_area() def clear_console(ev): doc[\"console\"].value = \"\" doc['run'].bind('click',run) doc['show_console'].bind('click',show_console) doc['clear_console'].bind('click',clear_console) Filename: .txt Run Output 清除 from browser import document as doc import script1 def ex1(ev): script1.editor.setValue('''for i in range(10): print(i) ''') script1.editor.scrollToRow(0) script1.editor.gotoLine(0) doc['ex1'].bind('click',ex1) ex1 - 簡單的 for 迴圈範例 from browser import document as doc import script1 def ex2(ev): script1.editor.setValue('''#溫度轉換程式 from browser import document as doc # 因為此函式與滑鼠互動, 需要 event 當作輸入 def convTemp(): mystring = \"\" cdegree = input(\"請輸入攝氏溫度:\") fdegree = float(cdegree)*9/5 + 32 output_string = \"攝氏 \" + str(cdegree) + \"度=華氏 \" + str(fdegree) + \"度\" # 利用 print() 將轉換結果送到 console 區 print(output_string) #直接呼叫 convTemp() 執行 convTemp() ''') script1.editor.scrollToRow(0) script1.editor.gotoLine(0) doc['ex2'].bind('click',ex2) ex2 - input() 與函式定義進行溫度轉換 from browser import document as doc import script1 def ex3(ev): script1.editor.setValue('''# this is a comment import math # imports make code from other modules available # code blocks are initiated by a trailing colon followed by indented lines class Circle: # define a class def __init__(self, radius): # constructor with parameter radius self.radius = radius # store the parameter in a class variable def get_area(self): # define a function that belongs to the class return math.pi*self.radius*self.radius # code that is not in a class is executed immediately for i in range(1, 10): # bitwise operation - https://wiki.python.org/moin/BitwiseOperators if (i & 1) == 0: continue circle = Circle(i) # create an instance print(\"A circle with radius {0} has area {1:0.2f}\".format( i, circle.get_area() # `print` writes output to the console )) ''') script1.editor.scrollToRow(0) script1.editor.gotoLine(0) doc['ex3'].bind('click',ex3) ex3 - 基本的物件導向範例 from browser import document as doc import script1 def ex4(ev): script1.editor.setValue('''#ex4 from browser.local_storage import storage # 列出 py_src 對應的儲存內容 print(storage[\"py_src\"]) # 接著將要使用 FileSaver.js 將內容存在 local 區 # https://github.com/eligrey/FileSaver.js/ # https://eligrey.com/demos/FileSaver.js/ ''') script1.editor.scrollToRow(0) script1.editor.gotoLine(0) doc['ex4'].bind('click',ex4) ex4 - 將程式在近端存檔 from browser import document from browser import alert"},{"url":"./w10-brython-hui-tu-fan-li.html","tags":"Course","title":"W10 Brython 繪圖範例","text":"Brython 繪圖 繪圖流程, 導入程式庫, 啟動, 然後引用各種模組開始繪圖 window.onload=function(){ brython(1); } from browser import document as doc import math canvas = doc[\"guitarchord\"] ctx = canvas.getContext(\"2d\") ctx.beginPath() ctx.lineWidth = 1 inc = 10 for i in range(5): ctx.moveTo(100+i*inc, 100) ctx.lineTo(100+i*inc, 200) ctx.lineWidth = 1 ctx.moveTo(200, 200) ctx.lineTo(250, 350) ctx.lineTo(350, 200) ctx.lineTo(200, 200) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"black\" ctx.stroke() ctx.closePath() 繪圖流程, 導入程式庫, 啟動, 然後引用各種模組開始繪圖 window.onload=function(){ brython(1); } from browser import document as doc from browser import html import math import re # 準備繪圖畫布 canvas = doc[\"japanflag3\"] container = doc[\"container3\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 水平線 for i in range(5): ctx.beginPath() # 設定線的寬度為 1 個單位 if i == 0: ctx.lineWidth = 7 else: ctx.lineWidth = 1 ctx.moveTo(99, 100+i*30) ctx.lineTo(201, 100+i*30) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" ctx.stroke() ctx.closePath() # 垂直線 for i in range(6): ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 ctx.moveTo(100+i*20, 100) ctx.lineTo(100+i*20, 220) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" ctx.stroke() ctx.closePath() # 1 與 A7 ctx.beginPath() ctx.fillStyle = 'black' ctx.strokeStyle = \"black\" ctx.font = \"30px Arial\" ctx.fillText(\"A7\", 100, 70) ctx.arc(50, 50, 9, 0, 2*math.pi, False) ctx.fill() ctx.stroke() ctx.closePath() ctx.beginPath() ctx.fillStyle = 'white' ctx.font = \"16px Arial\" ctx.fillText(\"1\", 45, 55) ctx.fill() ctx.stroke() ctx.closePath() # 3 ctx.beginPath() ctx.fillStyle = 'black' ctx.strokeStyle = \"black\" ctx.arc(50, 80, 9, 0, 2*math.pi, False) ctx.fill() ctx.stroke() ctx.closePath() ctx.beginPath() ctx.fillStyle = 'white' ctx.font = \"16px Arial\" ctx.fillText(\"3\", 45, 85) ctx.fill() ctx.stroke() ctx.closePath() # 4 ctx.beginPath() ctx.fillStyle = 'black' ctx.strokeStyle = \"black\" ctx.arc(50, 110, 9, 0, 2*math.pi, False) ctx.fill() ctx.stroke() ctx.closePath() ctx.beginPath() ctx.fillStyle = 'white' ctx.font = \"16px Arial\" ctx.fillText(\"4\", 45, 115) ctx.fill() ctx.stroke() ctx.closePath() # o ctx.beginPath() ctx.arc(50, 140, 7, 0, 2*math.pi, False) ctx.lineWidth =3 ctx.strokeStyle = \"black\" ctx.stroke() ctx.closePath() # x ctx.beginPath() #ctx.arc(50, 170, 7, 0, 2*math.pi, False) ctx.moveTo(44, 164) ctx.lineTo(56, 176) ctx.moveTo(56, 164) ctx.lineTo(44, 176) ctx.lineWidth =3 ctx.strokeStyle = \"black\" ctx.stroke() ctx.closePath() ''' # 以下將 canvas 畫布內容轉為 img tag, 並且顯示在 container 物件 img = canvas.toDataURL(\"image/png\") # 利用 re.sub, 將原本要直接開圖檔的 data:image 標頭, 改為 data:application/octet-stream, 可直接下載存檔 # 使用 re 模組之前必須先 import re img = re.sub(\"&#94;data:image\\/[&#94;;]\", \"data:application/octet-stream\", img) # 宣告 anchor markup attribute download, 可以指定下載儲存檔名 container <= html.A(\"save image\", href=img, download=\"guitar_chord.png\") ''' 請注意, 開發 Brython 程式時, 建議使用 Firefox 開啟網誌, 因為反應速度較 Chrome 快速. 請各組利用上列程式範例片段, 完成下列和弦繪圖:"},{"url":"./2016fall-min-jin-dang-tuan-rang-bu-lao-ji-fa-zhong-hui-wei-yuan-hui-shen-cha.html","tags":"Misc","title":"2016Fall 民進黨團讓步 勞基法重回委員會審查","text":"關乎勞工一例一休的勞基法修法，朝野昨協商有重大突破，民進黨團讓步，同意勞基法重回委員會審查，但有兩附帶條件就是出委員會後排除一個月冷凍期、各黨團簽署同意不杯葛。 國民黨與時代力量黨團都表示要回去研商，對重審持正面意見。若在野黨都同意，最快下周將在委員會審查。 「重審和我們當初呼籲一致」，國民黨團總召廖國棟表示，他們一開始就希望重審，也曾跟民進黨團討論，但前陣子協商不順利，只是重審有附帶條件，因此還需跟黨籍立委討論。 時代力量總召徐永明說，重回委員會審查，一向是時代力量立場，且社會十分關注這件事，如果協商再沒結果，立法院會給社會負面形象，既然重回委員會審查時間足夠，今天應該會有最後結果。 民進黨團總召柯建銘表示，如果在野黨團都同意，就可以在下周花三天時間處理勞基法，一天辦公聽會、兩天委員會審查。 柯說，勞基法已拖延了三、四個月，只要出委員會，仍可以在院會討論協商，大家講好就好，這樣的解決方式，各黨團應該能接受，也是民進黨釋出的最大誠意。 ★更多相關新聞 抓到了！勘驗一例一休錄影 王育敏二度喊「有異議」 遭批主持議事裝聾作啞 陳瑩委屈哽咽 別再叫我側翼 大綠小綠爭什麼？ 一例一休僅3成支持 近4成勞工休假不正常 「一例一休」限時3天審議，工鬥盧其宏批：假退回真硬幹，絕食將繼續"},{"url":"./2016fall-ji-jie-she-ji-zhu-ti-jiao-xue-midterm.html","tags":"Misc","title":"2016Fall 機械設計主題教學(midterm)","text":"知識管理與最佳化應用實驗室試圖利用計算機程式、網際內容管理、電腦輔助設計實習與協同產品設計實習等課程, 進行與機械設計相關的主題式教學, 其中包含強化創造力的教學、令學員熟習六種工程表達方式, 並且俱備融入協同設計所需要的四大面向知識與技能."},{"url":"./2016fall-cheng-shi-lian-xi-ti.html","tags":"Misc","title":"2016Fall 程式練習題","text":"已知截至第六週 2016fallcpa 的分組資料位於倉儲中的 w6_group.txt , 而從學校修課系統下載的修課人員名條則為 w6_list.txt , 請各組著手練習, 找出尚未納入分組的人員名單, 並研擬如何處置上課一個半月卻尚未進入情況的學員? 以下利用 Brython 讀取位於倉儲中的 w6_list.txt 與 w6_group.txt 資料檔案. 表示學校教務系統中, 修 2016fallcpa 的學員名單為: window.onload=function(){ brython(1); } from browser import document, html container = document['container'] data = open(\"./../w6_list.txt\").read() container <= data 而截至 w6, 納入分組名單中的學員有: from browser import document, html container2 = document['container2'] data2 = open(\"./../w6_group.txt\").read() container2 <= data2 現在, 誰能夠幫我們找出至今尚未納入分組名單中的學員, 共有那些人？ from browser import document, html # 從 id=script1 程式區段取 data 變數 from script1 import data container3 = document['container3'] data3 = open(\"./../w6_group.txt\").read() group = data3.splitlines() # 希望將分組資料轉為學員數列, 令為變數名稱 result_g result_g = [] # 已經註冊者數列設為 registered registered = [] for line in group: # 去除每一行最後的空白成員 sline = line.split(\",\") # 再將各組拆成個別組員後, 串成 result_g for m in sline: result_g.append(m) #container3 <= len(sline) #container3 <= html.BR() #container3 <= len(result_g) registered = data.splitlines()[:-1] # 設法找出至今尚未分組的學員學號 not_in_group = [c for c in registered if c not in result_g] #container3 <= len(registered) -len(result_g) n = 1 for i in not_in_group: container3 <= \"第\"+str(n)+\"位: \"+ str(i) n = n + 1 container3 <= html.BR()"},{"url":"./2016fall-ji-jie-she-ji-zhu-ti-jiao-xue.html","tags":"Misc","title":"2016Fall 機械設計主題教學","text":"知識管理與最佳化應用實驗室試圖利用計算機程式、網際內容管理、電腦輔助設計實習與協同產品設計實習等課程, 進行與機械設計相關的主題式教學, 其中包含強化創造力的教學、令學員熟習六種工程表達方式, 並且俱備融入協同設計所需要的四大面向知識與技能. 機械設計主題教學 創造力三元素, 機械設計的六種表達, 協同設計的四大面向. 強化創造能力 - 自學力、程式力與想像力 (Creative Competencies) 熟習六種表達 - 口語、文字、2D、3D、理論與實體表達 (Six Presentation Methods) 融入協同設計 - 電腦、網路、軟硬體工具與協同專案 (Collaborative Designs) 計算機程式 從 Python3 的 print(), input(), 變數命名到關鍵字, 可以透過簡單的單位轉換問題進行練習: 首先我們舉 Python3 程式執行的三個地方: 在單機 Windows 10 操作系統環境下利用可攜程式系統執行 利用遠端桌面或 X-Windows, 在近端利用遠端的電腦硬體與操作系統執行 在近端利用瀏覽器執行 單機執行: 按下 start.bat 後, 系統就會配置好 git 與 Python3 的程式環境, 可以在命令列中直接用互動的方式執行 Python3 程式, 也可以在 SciTE 編輯器中, 透過設定按下 go 之後執行 所牽涉的問題: 可攜程式環境如何建立? Python3 執行環境如何配置? 執行的 Python3 是那一個版本? 希望在 SciTE 中直接執行 Python3 程式, 該如何設定? 能不能在 Leo Editor 中執行 Python3 程式, 為何要這樣做? 近端連到遠端執行: 以 Remote Desktop, 連接到遠端的電腦畫面中執行可攜程式系統中的 Python3 程式, 基本架構與流程與近端單機執行相同. 利用 putty 與 Xming, 連線到支援 X-Windows 協定的電腦, 將遠端的視窗搬到近端執行, 但仍使用遠端電腦的硬體與軟體支援. 在瀏覽器中執行: 由於網際瀏覽器環境所整合的工具愈來愈多, 就連原本只能在單機執行的 SolidWorks, 也已經有初步成型的 OnShape 可以取代部份的零組件設計分析工作, 因此本課程以 Brython 為例, 說明如何在瀏覽器中執行 Python3 程式. 所牽涉問題: 如何設置? Brython Console 所有近端能執行的程式都能利用瀏覽器執行? 以下使用 Brython 標準程式庫執行 Python3 繪圖程式: window.onload=function(){ brython(1); } # 導入 browser 模組中的 document, 並設為 doc 變數 from browser import document as doc # 導入數學模組 import math # 產生各小球的亂數速度用 import random # 導入 browser 中的計時器, 建立動畫用 import browser.timer # 準備繪圖畫布 canvas = doc[\"plotarea\"] ctx = canvas.getContext(\"2d\") # 取畫布的寬與高度 width = canvas.width height = canvas.height n = 20 # 已知數列內容個數, 先分別與 None 對應 x = [None]*n y = [None]*n vy = [None]*n vx = [None]*n # 重力加速度, Y 方向向下為正 g = 0.05 # 空氣的黏滯阻尼係數 cor = 0.7 # 球的彈力係數 fr = 0.95 # 球的半徑 r = 5 for i in range(n): x[i] = 300 y[i] = 100 # random.random() 將會產生介於 0 與 1 的浮點亂數 vx[i] = 2*(random.random()-.5) vy[i] = 2*(random.random()-.5) # 更新第 i 球 Y 座標的運算邏輯 def updateY(i): if ((y[i]+r) < height): #y = height vy[i] += g else: vy[i] = -vy[i]*cor vx[i] *= fr y[i] += vy[i] if ((y[i]+r) > height): y[i] = height-r # 更新第 i 球 X 座標的運算邏輯 def updateX(i): if ((x[i]+r) >= width or (x[i]-r) <= 0): vx[i] = -vx[i]*cor x[i] += vx[i] if ((x[i]+r) > width): x[i] = width-r elif ((x[i]-r) < 0): x[i] = r # 畫圓函式 def circle(x,y,r): ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) ctx.fill() ctx.closePath() # 寫字函式 def text(s): ctx.fillStyle = \"#ff0000\" ctx.font = \"30px sans-serif\" ctx.textBaseline = \"bottom\" ctx.fillText(s,0,height) # 每隔特定時間, 進行動畫繪製 def animate(): # 刷新畫布 ctx.clearRect(0, 0, width, height) # 逐一重新繪製小球 ctx.fillStyle = \"#000000\" for i in range(n): updateY(i) updateX(i) circle(x[i],y[i],r) text(\"Click me!\") # 畫布點擊後執行的函式 def on_canvas_click(ev): browser.timer.set_interval(animate,0) # 只要使用者點擊在畫布上任何地方, 即執行 on_canvas_click 函式 canvas.bind('click', on_canvas_click, False) 上面小球自由落體的繪圖程式: <canvas id=\"plotarea\" width=\"600\" height=\"400\"></canvas> <script type=\"text/python3\"> # 導入 browser 模組中的 document, 並設為 doc 變數 from browser import document as doc # 導入數學模組 import math # 產生各小球的亂數速度用 import random # 導入 browser 中的計時器, 建立動畫用 import browser.timer # 準備繪圖畫布 canvas = doc[\"plotarea\"] ctx = canvas.getContext(\"2d\") # 取畫布的寬與高度 width = canvas.width height = canvas.height n = 20 # 已知數列內容個數, 先分別與 None 對應 x = [None]*n y = [None]*n vy = [None]*n vx = [None]*n # 重力加速度, Y 方向向下為正 g = 0.05 # 空氣的黏滯阻尼係數 cor = 0.7 # 球的彈力係數 fr = 0.95 # 球的半徑 r = 5 for i in range(n): x[i] = 300 y[i] = 100 # random.random() 將會產生介於 0 與 1 的浮點亂數 vx[i] = 2*(random.random()-.5) vy[i] = 2*(random.random()-.5) # 更新第 i 球 Y 座標的運算邏輯 def updateY(i): if ((y[i]+r) < height): #y = height vy[i] += g else: vy[i] = -vy[i]*cor vx[i] *= fr y[i] += vy[i] if ((y[i]+r) > height): y[i] = height-r # 更新第 i 球 X 座標的運算邏輯 def updateX(i): if ((x[i]+r) >= width or (x[i]-r) <= 0): vx[i] = -vx[i]*cor x[i] += vx[i] if ((x[i]+r) > width): x[i] = width-r elif ((x[i]-r) < 0): x[i] = r # 畫圓函式 def circle(x,y,r): ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) ctx.fill() ctx.closePath() # 寫字函式 def text(s): ctx.fillStyle = \"#ff0000\" ctx.font = \"30px sans-serif\" ctx.textBaseline = \"bottom\" ctx.fillText(s,0,height) # 每隔特定時間, 進行動畫繪製 def animate(): # 刷新畫布 ctx.clearRect(0, 0, width, height) # 逐一重新繪製小球 ctx.fillStyle = \"#000000\" for i in range(n): updateY(i) updateX(i) circle(x[i],y[i],r) text(\"Click me!\") # 畫布點擊後執行的函式 def on_canvas_click(ev): browser.timer.set_interval(animate,0) # 只要使用者點擊在畫布上任何地方, 即執行 on_canvas_click 函式 canvas.bind('click', on_canvas_click, False) </script> 繪製日本國旗: 步驟1, 先能畫一條線: <canvas id=\"japanflag1\" width=\"600\" height=\"250\"></canvas> <script type=\"text/python3\"> from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag1\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 先畫一條直線 ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (100, 100) 座標點 ctx.moveTo(100, 100) # 然後畫直線到 (150, 200) 座標點 ctx.lineTo(150, 200) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() </script> from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag1\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 先畫一條直線 ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (100, 100) 座標點 ctx.moveTo(100, 100) # 然後畫直線到 (150, 200) 座標點 ctx.lineTo(150, 200) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() 接著畫四條直線: <canvas id=\"japanflag2\" width=\"600\" height=\"400\"></canvas> <script type=\"text/python\"> # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag2\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(x1, y1, x2, y2): global ctx ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (10, 10) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(10, 10, 410, 10) draw_line(10, 310, 410, 310) # 再畫兩條垂直線 draw_line(10, 10, 10, 310) draw_line(410, 10, 410, 310) </script> # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag2\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(x1, y1, x2, y2): global ctx ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (10, 10) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(10, 10, 410, 10) draw_line(10, 310, 410, 310) # 再畫兩條垂直線 draw_line(10, 10, 10, 310) draw_line(410, 10, 410, 310) 接著在四條直線中央畫一個圓: <canvas id=\"japanflag3\" width=\"650\" height=\"450\"></canvas> <script type=\"text/python\"> from browser import document import math # 準備繪圖畫布 canvas = document[\"japanflag3\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(x1, y1, x2, y2): global ctx ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (10, 10) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(10, 10, 410, 10) draw_line(10, 310, 410, 310) # 再畫兩條垂直線 draw_line(10, 10, 10, 310) draw_line(410, 10, 410, 310) # 以下要在框線中央畫一個圓, 設半徑為 80 # context.arc(x,y,r,sAngle,eAngle,counterclockwise) # arc(圓心 x, 圓心 y, 起始角, 終點角, 是否逆時鐘轉) circle_x = 10 + 400/2 circle_y = 10 + 300/2 ctx.beginPath() ctx.arc(circle_x, circle_y, 80, 0, math.pi*2, True) # 設線顏色為紅色 ctx.strokeStyle = 'rgb(255, 0, 0)' ctx.stroke() # 填色設為紅色 ctx.fillStyle = 'rgb(255, 0, 0)' ctx.fill() ctx.closePath() </script> from browser import document import math # 準備繪圖畫布 canvas = document[\"japanflag3\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(x1, y1, x2, y2): global ctx ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (10, 10) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(10, 10, 410, 10) draw_line(10, 310, 410, 310) # 再畫兩條垂直線 draw_line(10, 10, 10, 310) draw_line(410, 10, 410, 310) # 以下要在框線中央畫一個圓, 設半徑為 80 # context.arc(x,y,r,sAngle,eAngle,counterclockwise) # arc(圓心 x, 圓心 y, 起始角, 終點角, 是否逆時鐘轉) circle_x = 10 + 400/2 circle_y = 10 + 300/2 ctx.beginPath() ctx.arc(circle_x, circle_y, 80, 0, math.pi*2, True) # 設線顏色為紅色 ctx.strokeStyle = 'rgb(255, 0, 0)' ctx.stroke() # 填色設為紅色 ctx.fillStyle = 'rgb(255, 0, 0)' ctx.fill() ctx.closePath() 然後將各繪圖模組寫成函式: <canvas id=\"japanflag4\" width=\"650\" height=\"450\"></canvas> <script type=\"text/python\"> # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag4\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(ctx, x1, y1, x2, y2): ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 將外框線寫成函式, 寬為高的 3/2 倍 # 因為 draw_frame 函式呼叫 draw_line() 因此要在其後定義 def draw_frame(ctx, x, y, w): # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (x, y) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(ctx, x, y, w*3/2+x, y) draw_line(ctx, x, w+y, w*3/2+x, w+y) # 再畫兩條垂直線 draw_line(ctx, x, y, x, w+y) draw_line(ctx, w*3/2+x, y, w*3/2+x, w+y) def draw_circle(x, y, r, fill=None): global ctx ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) if fill == None: ctx.fillStyle = 'rgb(255, 0, 0)' ctx.fill() else: ctx.strokeStyle = \"rgb(255, 0, 0)\" ctx.stroke() ctx.closePath() # 呼叫 draw_frame() width = 400 draw_frame(ctx, 10, 10, width) # 計算框的中心點座標 x_center = 10 + width*3/2/2 y_center = 10 + width/2 # 中間圓的直徑為寬的 3/5 radius = width*3/5/2 draw_circle(x_center, y_center, radius) </script> # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"japanflag4\"] ctx = canvas.getContext(\"2d\") # 以下可以利用 ctx 物件進行畫圖 # 因為要畫四條直線, 這裡要將畫直線改寫為函式 # 定義畫直線的函式, 以 (x1, y1) 為起點, 畫到 (x2, y2) def draw_line(ctx, x1, y1, x2, y2): ctx.beginPath() # 設定線的寬度為 1 個單位 ctx.lineWidth = 1 # 將畫筆移動到 (x1, y1) 座標點 ctx.moveTo(x1, y1) # 然後畫直線到 (x2, y2) 座標點 ctx.lineTo(x2, y2) # 設定顏色為藍色, 也可以使用 \"rgb(0, 0, 255)\" 字串設定顏色值 ctx.strokeStyle = \"blue\" # 實際執行畫線 ctx.stroke() ctx.closePath() # 將外框線寫成函式, 寬為高的 3/2 倍 # 因為 draw_frame 函式呼叫 draw_line() 因此要在其後定義 def draw_frame(ctx, x, y, w): # 準備呼叫 draw_line() 四次以便畫出國旗外框四條線 # 假設從 (x, y) 畫到 (410, 310) 的外框 # 先畫兩條水平線 draw_line(ctx, x, y, w*3/2+x, y) draw_line(ctx, x, w+y, w*3/2+x, w+y) # 再畫兩條垂直線 draw_line(ctx, x, y, x, w+y) draw_line(ctx, w*3/2+x, y, w*3/2+x, w+y) def draw_circle(x, y, r, fill=None): global ctx ctx.beginPath() ctx.arc(x, y, r, 0, math.pi*2, True) if fill == None: ctx.fillStyle = 'rgb(255, 0, 0)' ctx.fill() else: ctx.strokeStyle = \"rgb(255, 0, 0)\" ctx.stroke() ctx.closePath() # 呼叫 draw_frame() width = 400 draw_frame(ctx, 10, 10, width) # 計算框的中心點座標 x_center = 10 + width*3/2/2 y_center = 10 + width/2 # 中間圓的直徑為寬的 3/5 radius = width*3/5/2 draw_circle(x_center, y_center, radius) 接下來畫中華民國國旗: # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"rocflag\"] ctx = canvas.getContext(\"2d\") # 進行座標轉換, x 軸不變, y 軸反向且移動 canvas.height 單位光點 # ctx.setTransform(1, 0, 0, -1, 0, canvas.height) # 以下採用 canvas 原始座標繪圖 flag_w = canvas.width flag_h = canvas.height circle_x = flag_w/4 circle_y = flag_h/4 # 先畫滿地紅 ctx.fillStyle='rgb(255, 0, 0)' ctx.fillRect(0,0,flag_w,flag_h) # 再畫青天 ctx.fillStyle='rgb(0, 0, 150)' ctx.fillRect(0,0,flag_w/2,flag_h/2) # 畫十二道光芒白日 ctx.beginPath() star_radius = flag_w/8 angle = 0 for i in range(24): angle += 5*math.pi*2/12 toX = circle_x + math.cos(angle)*star_radius toY = circle_y + math.sin(angle)*star_radius # 只有 i 為 0 時移動到 toX, toY, 其餘都進行 lineTo if (i): ctx.lineTo(toX, toY) else: ctx.moveTo(toX, toY) ctx.closePath() # 將填色設為白色 ctx.fillStyle = '#fff' ctx.fill() # 白日:藍圈 ctx.beginPath() ctx.arc(circle_x, circle_y, flag_w*17/240, 0, math.pi*2, True) ctx.closePath() # 填色設為藍色 ctx.fillStyle = 'rgb(0, 0, 149)' ctx.fill() # 白日:白心 ctx.beginPath() ctx.arc(circle_x, circle_y, flag_w/16, 0, math.pi*2, True) ctx.closePath() # 填色設為白色 ctx.fillStyle = '#fff' ctx.fill() <canvas id=\"rocflag\" width=\"650\" height=\"450\"></canvas> <script type=\"text/python3\"> # 導入 doc from browser import document as doc import math # 準備繪圖畫布 canvas = doc[\"rocflag\"] ctx = canvas.getContext(\"2d\") # 進行座標轉換, x 軸不變, y 軸反向且移動 canvas.height 單位光點 # ctx.setTransform(1, 0, 0, -1, 0, canvas.height) # 以下採用 canvas 原始座標繪圖 flag_w = canvas.width flag_h = canvas.height circle_x = flag_w/4 circle_y = flag_h/4 # 先畫滿地紅 ctx.fillStyle='rgb(255, 0, 0)' ctx.fillRect(0,0,flag_w,flag_h) # 再畫青天 ctx.fillStyle='rgb(0, 0, 150)' ctx.fillRect(0,0,flag_w/2,flag_h/2) # 畫十二道光芒白日 ctx.beginPath() star_radius = flag_w/8 angle = 0 for i in range(24): angle += 5*math.pi*2/12 toX = circle_x + math.cos(angle)*star_radius toY = circle_y + math.sin(angle)*star_radius # 只有 i 為 0 時移動到 toX, toY, 其餘都進行 lineTo if (i): ctx.lineTo(toX, toY) else: ctx.moveTo(toX, toY) ctx.closePath() # 將填色設為白色 ctx.fillStyle = '#fff' ctx.fill() # 白日:藍圈 ctx.beginPath() ctx.arc(circle_x, circle_y, flag_w*17/240, 0, math.pi*2, True) ctx.closePath() # 填色設為藍色 ctx.fillStyle = 'rgb(0, 0, 149)' ctx.fill() # 白日:白心 ctx.beginPath() ctx.arc(circle_x, circle_y, flag_w/16, 0, math.pi*2, True) ctx.closePath() # 填色設為白色 ctx.fillStyle = '#fff' ctx.fill() </script>"}]};