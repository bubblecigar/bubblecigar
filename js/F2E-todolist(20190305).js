// var data_template = {
// 	title:"",
// 	isHighlight:false,
// 	isFinished:false,
// 	deadline_date:"",
// 	deadline_time:"",
// 	file_name:"",
// 	upload_time:"",
// 	comment:""
// }

initiate();

// initiate(): 
// 1. 賦予.option監聽事件(click)
// 2. 呼叫refresh_page()，製作初始畫面
function initiate(){

	if (localStorage.getItem('todoList') == null || localStorage.getItem('todoList') == "" ) {
		localStorage.setItem('todoList',"[]");
	}

	document.querySelector(".header").addEventListener("click",function(e){
		
		if (e.target.className == "header") {
			return
		}

		document.querySelector("#my_task").setAttribute("class","option");
		document.querySelector("#in_progress").setAttribute("class","option");
		document.querySelector("#completed").setAttribute("class","option");
		e.target.setAttribute("class","option triggered");
		
		switch (e.target.textContent) {
			case "My Tasks":
				document.querySelector(".content").setAttribute("class", "content my_tasks");
				break;
			case "In Progress":
				document.querySelector(".content").setAttribute("class", "content in_progress");
				break;
			case "Completed":
				document.querySelector(".content").setAttribute("class", "content completed");
				break;
			default:
				// statements_def
				break;
		}
		arrange_order();
		refresh_page();
	},true);
	document.querySelector(".content").setAttribute("class","content my_tasks");
	refresh_page();
}

// refresh_page():
// 1. 製作.add_task 以及 .foot
// 2. 呼叫load_task_boxes()，以製作.edit_task (此步驟後所有DOM建立完畢)
// 3. 賦予.add_task監聽事件(focus)
// 4. 呼叫activate_buttons()，以賦予.edit_task內部元素監聽事件
function refresh_page(){
	document.querySelector(".content").innerHTML = `
	<input type="text" placeholder="+ Add Task" class="add_task">`;

	load_task_boxes();

	var foot_node = document.createElement("p");
	foot_node.setAttribute("class","foot");
	

	if(document.querySelector(".content").className.includes("my_tasks")){
		foot_node.textContent = document.querySelectorAll(".edit_task").length + " tasks in sum";
	}else if (document.querySelector(".content").className.includes("in_progress")) {
		foot_node.textContent = (document.querySelectorAll(".edit_task").length - document.querySelectorAll(".isFinished").length) + " tasks left";
	}else if (document.querySelector(".content").className.includes("completed")){
		foot_node.textContent = document.querySelectorAll(".isFinished").length + " tasks completed";
	}

	document.querySelector('.content').appendChild(foot_node);

	document.querySelector(".add_task").addEventListener("focus",function(e){
		var initialize_data = {
			title:"",
			isHighlight:false,
			isFinished:false,
			deadline_date:"",
			deadline_time:"",
			file_name:"",
			upload_time:"",
			comment:""
		}
		// e.target.outerHTML = make_task_box(initialize_data);
		
		var nn = make_task_box_new(initialize_data);
		document.querySelector(".content").insertBefore(nn,document.querySelector('.add_task'));
		document.querySelector(".add_task").remove();
		document.querySelector(".confirm").textContent = "+ Add Task";
		document.querySelector(".cancel").textContent = "X Cancel";
		document.querySelector(".edit_task").setAttribute("class","edit_task");
		document.querySelector(".fa-edit.far").setAttribute("class","fa-edit fas");
		document.querySelector(".content").innerHTML += "";
		activate_buttons();
		document.querySelector(".title_input").select();
	},true);

	activate_buttons();
}

// load_task_boxes():
// 1. 從localStorage取得"todoList"的陣列資料 (array[data1,data2,...])
// 2. 呼叫make_task_box_new(datai), 將每筆資料製作為新的DOM node.
// 3. 將新的DOM node新增到.content
function load_task_boxes(){
	var ss = JSON.parse(localStorage.getItem("todoList"));
	for (var i = ss.length - 1; i >= 0; i--) {
		document.querySelector(".content").appendChild(make_task_box_new(ss[i]));
	}
}

// make_tasl_nox_new(data_template):
// 1. 依據data_template內的資料return node
function make_task_box_new(data_template){

	var title = data_template.title;
	var isHighlight = data_template.isHighlight;
	var isFinished = data_template.isFinished;
	var isChecked ="";
	var date = data_template.deadline_date;
	var time = data_template.deadline_time;
	var file_name = "";
	var upload_time = "";
	var comment = data_template.comment;
	var calendar_icon=`<span class="far fa-calendar-alt"></span>`;
	var file_icon=`<span class="far fa-file"></span>`;
	var comment_icon=`<span class="far fa-comment-dots"></span>`;

	if (data_template.title == "") {
		title = "Type Something here...";
	}
	if (data_template.isHighlight == true){
		isHighlight = "isHighlight";
		icon = `<span class="fas fa-star"></span>`;
	}else{
		isHighlight = "";
		icon = `<span class="far fa-star"></span>`;
	}
	if (data_template.isFinished == true) {
		isFinished = "isFinished";
		isChecked = "checked";
	}else{
		isFinished = "";
	}
	
	if (data_template.deadline_date != "") {
		date = data_template.deadline_date;
	}
	if (data_template.file_name != "") {
		file_name = data_template.file_name;
	}
	if (data_template.upload_time != "") {
		upload_time = data_template.upload_time;
	}
	if (data_template.comment != "") {
		comment = data_template.comment;
	}

	var data_str = JSON.stringify(data_template);


	var node_tree = document.createElement("div");
	node_tree.setAttribute("class", `edit_task brief ${isHighlight} ${isFinished}`);

	node_tree.innerHTML = `
			<div class="data_storage">
			</div>
			<div class="p1">
				
				<label>
					<input type="checkbox" class="ifFinish" ${isChecked}>
					<span class="checkmark"></span>
					<div class="canvas"></div>
				</label>

				<input type="text" placeholder="Type Something Here ..." class="title_input"> 
				<p class="title_output">
				</p>
				${icon}
				<span class="far fa-edit"></span>
				<p class="brief_description">
					${calendar_icon}	
					${file_icon}
					${comment_icon}
				</p>
			</div>
			<div class="p2">
				<span class="far fa-calendar-alt" style="display:inline !important"> Deadline</span>
				<br>
				<input type="text" class="date" placeholder="yyyy/mm/dd">
				<input type="text" class="time" placeholder="hh:mm">
				<br>
				<span class="far fa-file" style="display:inline !important"> File</span>
				<br>
				
				<div class="file">
					<div class="file_info">
						<p class="file_info1"></p>
						<p class="file_info2"></p>
					</div><div class="upload_file_btn">
						<p>
							+
						</p>
						<input type="file">			
					</div>
				</div>
				
				<br>
				<span class="far fa-comment-dots" style="display:inline !important"> Comment</span>
				<br>
				<textarea name="comment" class="comment" cols="30" rows="10" placeholder="Type your memo here..." >${data_template.comment}</textarea>
			</div>
			<div class="p3">
				<div class="cancel">
					X Delete
				</div><div class="confirm">
					+ Save
				</div>
			</div>`;

	node_tree.querySelector(".data_storage").textContent = data_str;
	node_tree.querySelector(".title_output").textContent = title;
	node_tree.querySelector(".title_input").setAttribute("value",title);

	node_tree.querySelector(".p1 span.far.fa-calendar-alt").textContent = date;
	node_tree.querySelector(".p1 span.far.fa-file").textContent = file_name;
	node_tree.querySelector(".p1 span.far.fa-comment-dots").textContent = comment;

	if (data_template.deadline_date == "") {
		node_tree.querySelector(".p1 span.far.fa-calendar-alt").setAttribute("style","display:none");
	}
	if (data_template.file_name == "") {
		node_tree.querySelector(".p1 span.far.fa-file").remove();
		node_tree.querySelector(".file_info").setAttribute("style","display:none");
	}
	if (data_template.comment == "") {
		node_tree.querySelector(".p1 span.far.fa-comment-dots").setAttribute("style","display:none");
	}

	node_tree.querySelector(".date").setAttribute("value",date);
	node_tree.querySelector(".time").setAttribute("value",time);
	node_tree.querySelector(".file_info1").textContent = file_name;
	node_tree.querySelector(".file_info2").textContent = upload_time;
	
	return node_tree;
}

// activate_buttons():
// 1. 賦予每個.edit_task中的各元素監聽事件
// 2. 依據不同按鈕呼叫下列函數之組合，來達成互動效果：
// 	  (a). 呼叫update_data_str(e, true): 儲存整個.edit_task中的所有input資料
//.   (b). 呼叫update_data_str(e, false): 僅儲存整個.edit_task中的所有toggle類型的input資料
//    (c). 呼叫upload_localStorage(): 將整個頁面中的所有資料上傳至localStorage 
//    (d). 呼叫arrange_order(): 整理localStorage中的資料排序 
//    (e). 呼叫refresh_page(): 重新製作頁面
function activate_buttons(){

	for (var i = document.querySelectorAll(".edit_task").length - 1; i >= 0; i--) {
		document.querySelectorAll(".confirm")[i].addEventListener("click", function(e){
			update_data_str(e,true);
			upload_localStorage();
			arrange_order();
			alert("data saved!");
			refresh_page();
		},true);
		document.querySelectorAll(".cancel")[i].addEventListener("click", function(e){
			e.target.parentElement.parentElement.outerHTML = "";
			upload_localStorage();
			arrange_order();
			alert("data deleted!")
			refresh_page();
			}
		,true);
		document.querySelectorAll(".ifFinish")[i].addEventListener("click", function (e){
			toggle_class(e.target.parentElement.parentElement.parentElement, "isFinished");
			update_data_str(e,false);
			upload_localStorage();
			arrange_order();
			// refresh_page();
		},true);
		document.querySelectorAll(".fa-star")[i].addEventListener("click", function (e){
			toggle_class(e.target.parentElement.parentElement, "isHighlight");
			toggle_class(e.target, "fas");
			toggle_class(e.target, "far");
			update_data_str(e, false);
			upload_localStorage();
			arrange_order();
			// refresh_page();
		},true);
		document.querySelectorAll(".fa-edit")[i].addEventListener("click", function (e){
			toggle_class(e.target.parentElement.parentElement, "brief");
			toggle_class(e.target, "fas");
			toggle_class(e.target, "far");
			update_data_str(e,false);
			upload_localStorage();
			e.target.parentElement.querySelector(".title_input").select();
		},true);
		document.querySelectorAll(".upload_file_btn input")[i].addEventListener("change", function (e){
			var task_box = e.target.parentElement.parentElement;
			task_box.querySelector(".file_info1").textContent = e.target.files[0].name;
			task_box.querySelector(".file_info2").textContent = Date().split(" ")[1]+" "+Date().split(" ")[2]+" "+Date().split(" ")[3];
			task_box.querySelector(".file_info").setAttribute("style", "display = block")
		},true);
		document.querySelectorAll(".file_info")[i].addEventListener("dblclick", function(e){
			var task_box = e.target.parentElement.parentElement;
			task_box.querySelector(".file_info1").textContent = "";
			task_box.querySelector(".file_info2").textContent = "";
		},true);
	}
}

// update_data_str(e,reviseAll):
// 1. 依據點擊事件更新.data_str中儲存的textContent
//   if (reviseAll = true) {依據所點區塊中的所有輸入資料更新.data_str中儲存的textContent}
//   if (reviseAll = false) {僅依據所點區塊中的toggle類型輸入資料更新.data_str中儲存的textContent}
function update_data_str(e, reviseAll){

	var task_box = e.target.parentElement.parentElement;
	if (task_box.className.split(" ").includes("edit_task")) {
	}else{
		task_box = e.target.parentElement.parentElement.parentElement;
	}

	if (reviseAll == true) {
		
		var data_template = JSON.parse(task_box.querySelector(".data_storage").textContent);
		
		data_template.title = task_box.querySelector(".title_input").value;
		data_template.deadline_date = task_box.querySelector(".date").value;
		data_template.deadline_time = task_box.querySelector(".time").value;	
		
		// file部分
		data_template.file_name = task_box.querySelector(".file_info1").textContent;
		data_template.upload_time = task_box.querySelector(".file_info2").textContent;

		data_template.comment = task_box.querySelector(".comment").value;
		if (task_box.className.split(" ").includes("isHighlight")){
			data_template.isHighlight = true;
		}else{
			data_template.isHighlight = false;
		}
		if (task_box.className.split(" ").includes("isFinished")){
			data_template.isFinished = true;
		}else {
			data_template.isFinished = false;
		}
		task_box.querySelector(".data_storage").textContent = JSON.stringify(data_template);
	}else{
		var data_template = JSON.parse(task_box.querySelector(".data_storage").textContent);
		if (task_box.className.split(" ").includes("isHighlight")){
			data_template.isHighlight = true;
		}else{
			data_template.isHighlight = false;
		}
		if (task_box.className.split(" ").includes("isFinished")){
			data_template.isFinished = true;
		}else {
			data_template.isFinished = false;
		}
		task_box.querySelector(".data_storage").textContent = JSON.stringify(data_template);
	}
}

// upload_localStorage():
// 1. 將每個.edit_task .data_str中所儲存的textContent上傳至localStorage的"todoList"
function upload_localStorage(){
	var all_data = [];
	for (var i = document.querySelectorAll(".edit_task").length - 1; i >= 0; i--) {
		all_data.push(JSON.parse(document.querySelectorAll(".data_storage")[i].textContent));
	}
	localStorage.setItem("todoList", JSON.stringify(all_data));
}

// arrange_order():
// 排列localStorage中"todoList"的陣列資料順序
function arrange_order(){
	
	var data_array = JSON.parse(localStorage.getItem("todoList"));
	var finished_tasks = [];
	var highlight_tasks = [];
	var regular_tasks = [];

	for (var i = data_array.length - 1; i >= 0; i--) {
		if (data_array[i].isHighlight ==false && data_array[i].isFinished == false) {
			regular_tasks.unshift(data_array[i]);
		}
		if (data_array[i].isFinished == true) {
			finished_tasks.unshift(data_array[i]);
		}else if (data_array[i].isHighlight == true ){
			highlight_tasks.unshift(data_array[i]);
		}
		
	}
	data_array = finished_tasks.concat(regular_tasks.concat(highlight_tasks));
	localStorage.setItem("todoList",JSON.stringify(data_array));
}


function toggle_class (node, targetClass){
	var classArray = node.className.split(" ");
	for (var i = classArray.length - 1; i >= 0; i--) {
		if (classArray[i] == targetClass){
			classArray.splice(i,1);
			node.setAttribute("class", classArray.join(" "));
			return
		}
	}
	classArray.push(targetClass);
	node.setAttribute("class", classArray.join(" "));
}

