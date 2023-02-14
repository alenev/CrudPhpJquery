const USERS_FORM_BUTTON_CREATE = 'Добавить';
const USERS_FORM_BUTTON_EDIT = 'Редактировать';
const USERS_MESSAGE_CREATE_SUCCESS = 'Пользователь добавлен';
const USERS_MESSAGE_DELETE = 'Пользователь удален';
const USERS_MESSAGE_DELETE_ERROR = 'Ошибка удаления пользователя';
const USERS_MESSAGE_EDIT_SUCCESS = 'Пользователь отредактирован';
const GOODS_ITEM_PRICE = 'Цена';
const GOODS_ITEM_BRAND = 'Бренд';
const GOODS_ITEM_CAPACITY_GB = 'Обьем памяти (GB)';
const GOODS_ITEM_TYPE = 'Тип';

jQuery(document).ready(function () {

	function usersFormValidation() {
		let errors = 0;
		if ($('.user-first-name').val().length < 1) {
			$('.user-first-name').addClass('input-error');
			errors++;
		}
		if ($('.user-last-name').val().length < 1) {
			$('.user-last-name').addClass('input-error');
			errors++;
		}
		if ($('.user-position').val().length < 1) {
			$('.user-position').addClass('input-error');
			errors++;
		}
		if (errors > 0) {
			return false;
		} else {
			return true;
		}
	}

	function resetUserForm() {
		$(".users-form form")[0].reset();
		$('#user-form-event').val('create');
		$('#user-id').val('');
		$('.users-form .edit-button').hide();
		$('.users-form .create-button').show();
	}
	function renderSuccesMessage(message = null, block = $('.users-form')) {
		console.log(message);
		block.find('.message').text(message);
		block.find('.message').attr("class", "message success");
	}
	function renderErrorMessage(message = null, block = $('.users-form')) {
		block.find('.message').text(message);
		block.find('.message').attr("class", "message error");
	}
	function userListItemTemplate(user = null) {
		if (user) {
			return '<div class="col col1">' + user.first_name + '</div><div class="col col2">' + user.last_name + '</div><div class="col col3">' + user.position + '</div><div class="col col4"><i class="edit">&#9998</i><i class="delete">&#9003;</i></div>';
		}
	}
	function renderUserItem(user = null) {
		if (user) {
			let user_item = '<div class="row" data-id="' + user.id + '">' + userListItemTemplate(user) + '</div>';
			$(".users-list").append(user_item);
		}
	}
	function reRenderUserItem(user = null) {
		if (user) {
			$('.users-list').find('.row').each(function () {
				if ($(this).attr('data-id') == user.id) {
					$(this).html(userListItemTemplate(user));
				}
			});
		}
	}
	$(document).on('click', function () {
		$('.users-form input[type="text"], .users-form select').removeClass('input-error');
		$(this).find('.form-box .message').text('');
	});


	$.ajax({
		type: 'POST',
		url: './form.php',
		data: { 'event': 'getAllUsers' },
		dataType: 'json',
		success: function (json) {
			if (json && json.length > 0) {
				json.forEach(user => {
					renderUserItem(user);
				});
			}
		}
	});

	$('.users-form form').submit(function (e) {
		e.preventDefault();
		if (!usersFormValidation()) {
			return false;
		}
		var postdata = $('.users-form form').serialize();
		$.ajax({
			type: 'POST',
			url: './form.php',
			data: postdata,
			dataType: 'json',
			success: function (json) {
				if (json.error && json.error.length > 0) {
					renderErrorMessage(json.error, $('.users-form'));
				} else {
					if ($('#user-form-event').val() == 'create') {
						renderSuccesMessage(USERS_MESSAGE_CREATE_SUCCESS, $('.users-form'));
						renderUserItem(json[0]);
					}
					if ($('#user-form-event').val() == 'edit') {
						renderSuccesMessage(USERS_MESSAGE_EDIT_SUCCESS, $('.users-form'));
						reRenderUserItem(json[0]);
					}
					resetUserForm();
				}
			}
		});
	});

	$(document).on('click', '.users-list .delete', function () {
		let row = $(this).closest(".row");
		let userId = row.attr("data-id");
		$.ajax({
			type: 'POST',
			url: './form.php',
			data: { 'event': 'removeUser', 'id': userId },
			dataType: 'json',
			success: function (result) {
				if (result) {
					renderSuccesMessage(USERS_MESSAGE_DELETE, $('.users-list-box'));
					$('.users-list').find('.row').each(function () {
						if ($(this).attr("data-id") == userId) {
							$(this).remove();
						}
					});
				} else {
					renderErrorMessage(USERS_MESSAGE_DELETE_ERROR, $('.users-list-box'));
				}
			}
		});
	});

	$(document).on('click', '.users-list .edit', function () {
		let row = $(this).closest('.row');
		let userId = row.attr('data-id');
		$('#user-form-event').val('edit');
		$('#user-id').val(userId);
		$('#user-first-name').val(row.find(".col1").text());
		$('#user-last-name').val(row.find(".col2").text());
		$('#user-position').val(row.find(".col3").text());
		$('.users-form .edit-button').show();
		$('.users-form .create-button').hide();
	});

	$(document).on('click', '.users-form .edit-close', function () {
		resetUserForm();
	});

	function groupArrayByField(xs, key) {
		return xs.reduce(function (rv, x) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	}

	function goodsListRender(goods = null) {
		if (goods) {
			console.table(goods);
			let goodsItems = groupArrayByField(goods, 'id');
			let goodsListTpl = '';
			Object.keys(goodsItems).forEach(key => {

				let goodItemTpl = '';


				let googdItemAttrAll = '';
				goodsItems[key].forEach(function (props, i) {
					let googdItemAttr = '';
					if (i == 0) {
						if (props.good_name) {
							goodItemTpl += '<div class="good-name">' + props.good_name + '</div>';
						}
						if (props.good_price) {
							goodItemTpl += '<div class="good-price">' + GOODS_ITEM_PRICE + ': ' + props.good_price + '</div>';
						}
						goodItemTpl = '<div class="good-item-main">' + goodItemTpl + '</div>';

					}


					let itemAttrLabel = '';
					if (props.attribute_name == 'Brand') {
						itemAttrLabel = GOODS_ITEM_BRAND;
					}
					if (props.attribute_name == 'Capacity_GB') {
						itemAttrLabel = GOODS_ITEM_CAPACITY_GB;
					}
					if (props.attribute_name == 'Type') {
						itemAttrLabel = GOODS_ITEM_TYPE;
					}
					if (props.attribute_name) {
						googdItemAttr += '<div class="good-attribute-name">' + itemAttrLabel + ': </div>';
					}
					if (props.attribute_value) {
						googdItemAttr += '<div class="good-attribute-value">' + props.attribute_value + '</div>';
					}
					googdItemAttr = '<div class="good-item-attr">' + googdItemAttr + '</div>';
					googdItemAttrAll += googdItemAttr;

				});

				goodItemTpl = '<div class="good-item">' + goodItemTpl + '' + googdItemAttrAll + '</div>';
				goodsListTpl += goodItemTpl;
			});

			$('.goods-list-box .goods-list').html(goodsListTpl);

		}
	}

	$.ajax({
		type: 'POST',
		url: './form.php',
		data: { 'event': 'getAllGoodsWithAttributes' },
		dataType: 'json',
		success: function (json) {
			goodsListRender(json);
		}
	});

});
