$(function() {
  let cart = [];

  // Render functions
  const renderItem = function(item) {
    let element = $(
      `<div class="col-sm-6 col-md-4">
        <div class="thumbnail">
          <img>
          <div class="caption">
            <h3></h3>
            <p class="price"></p>
            <p><a href="#" class="btn btn-primary" role="button">Add to Cart</a></p>
          </div>
        </div>
      </div>`);
    element.find('img').attr('src', item.imageUrl);
    element.find('h3').text(item.name);
    element.find('.price').text('Price: $' + item.price);
    element.find('a').on('click', function() {
      api.putInCart(item);
      return false;
    });
    return element;
  };

  const renderCartItem = function(cartItem) {
    let element = $(
      `<a class="list-group-item">
        <form class="form-inline">
          <div class="form-group">
            <h4 class="list-group-item-heading"></h4>
            <p class="price list-group-item-text"></p>
            <span class="list-group-item-text">Quantity: </span>
            <input type="text" class="quantity-field form-control">
            <button type="button" class="btn btn-primary update-button">Update</button>
            <button type="button" class="btn btn-danger remove-button">Remove</button>
          </div>
        </form>
      </a>`);
      element.find('h4').text(cartItem.name);
      element.find('.price').text('Price: $' + cartItem.price);
      let quantityField = element.find('.quantity-field');
      quantityField.val(cartItem.quantity);
      element.find('.update-button').on('click', function () {
        let quantity = quantityField.val();
        if (!quantity || isNaN(quantity)) {
          alert('You must enter a valid number');
          return false;
        }
        let quantityInt = parseInt(quantity);
        if (!quantityInt || quantityInt < 1) {
          alert('You must enter a valid number');
          return false;
        }
        cartItem.quantity = quantityInt;
        api.putInCart(cartItem);
        return false;
      });
      element.find('.remove-button').on('click', function () {
        api.deleteFromCart(cartItem.id);
        return false;
      });
      return element;
  };

  const renderCart = function() {
    let totalQuantity = 0;
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
      totalQuantity = totalQuantity + cart[i].quantity;
      totalPrice = totalPrice + (cart[i].price * cart[i].quantity);
    }
    $('#cart-quantity').text(totalQuantity);
    $('#total').text(totalPrice);
    if (cart.length > 0) {
      $('#cart-empty-state').hide();
      $('#cart-list').empty();
      $('#cart-container').show();
      for (let i = 0; i < cart.length; i++) {
        $('#cart-list').append(renderCartItem(cart[i]));
      }
    } else {
      $('#cart-empty-state').show();
      $('#cart-container').hide();
    }
  };

  // API
  const api = {
    loadItems: function() {
      $.get('/api/v1/items', function(data) {
        for (let i = 0; i < data.length; i++) {
          $('#items-list').append(renderItem(data[i]));
        }
      });
    },
    loadCart: function() {
      $.get('/api/v1/cart', function(data) {
        cart = data;
        renderCart();
      });
    },
    putInCart: function(item) {
      $.ajax({
        url: '/api/v1/cart',
        data: JSON.stringify(item),
        type: 'PUT',
        contentType: 'application/json',
      }).done(function() {
        api.loadCart();
      })
    },
    deleteFromCart: function(itemId) {
      $.ajax({
        url: '/api/v1/cart/' + itemId,
        type: 'DELETE',
      }).done(function() {
        api.loadCart();
      })
    },
  };

  // Event handlers
  $('#nav-cart-link').on('click', function() {
    $('#items-list').hide();
    $('#cart').show();
    $('#nav-items').removeClass('active');
    $('#nav-cart').addClass('active');
  });

  $('#nav-items-link').on('click', function() {
    $('#items-list').show();
    $('#cart').hide();
    $('#nav-items').addClass('active');
    $('#nav-cart').removeClass('active');
  });

  // Initial load
  api.loadItems();
  api.loadCart();
});
