const stripe = Stripe('pk_test_51LrDf7SBL8mvURHljuTfIvt9UV2CqmlEd8jQrrYTnu5HswVAQxLSvuFxExmCqmBuRvkibVkLlpYLvD35k5mDUfjE00Kf1zeLqo'); // Your Publishable Key
const elements = stripe.elements();


const paymentType = document.querySelector("#paymentType")

let card = null
function mountWidget() {
  var style = {
    base: {
      color: "#black"
    }
  };

  card = elements.create('card', { style, hidePostalCode: true });
  card.mount('#card-element');

  const form = document.querySelector('form');
  const errorEl = document.querySelector('#card-errors');

  // Give our token to our form
  const stripeTokenHandler = token => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    form.submit();
  }
}

paymentType.addEventListener('change', (e) => {
  debugger
  if (e.target.value == "card") {
    mountWidget()
  }
  else {
    card.destroy()
  }
})

  // Create token from card data
  form.addEventListener('submit', e => {
    e.preventDefault();

    stripe.createToken(card).then(res => {
      if (res.error) errorEl.textContent = res.error.message;
      else stripeTokenHandler(res.token);
    })
  })
