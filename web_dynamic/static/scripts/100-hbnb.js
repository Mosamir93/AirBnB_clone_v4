$(document).ready(function () {
  $.get('http://127.0.0.1:5001/api/v1/status', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function fetchPlaces (data = {}) {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json', // Corrected casing
      data: JSON.stringify(data),
      success: function (data) {
        $('section.places').empty();
        data.forEach(place => {
          const article = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>`;
          $('section.places').append(article);
        });
      }
    });
  }

  fetchPlaces();

  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  $('input[type="checkbox').change(function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    const type = $(this).closest('.popover').prev().text().trim();

    if ($(this).is(':checked')) {
      if (type === 'States') {
        selectedStates[id] = name;
      } else if (type === 'Amenities') {
        selectedAmenities[id] = name;
      } else {
        selectedCities[id] = name;
      }
    } else {
      if (type === 'States') {
        delete selectedStates[id];
      } else if (type === 'Amenities') {
        delete selectedAmenities[id];
      } else {
        delete selectedCities[id];
      }
    }
    const updateText = (dict, selector) => {
      const names = Object.values(dict).join(', ');
      if (names.length > 0) {
        $(selector).text(names);
      } else {
        $(selector).html('&nbsp;');
      }
    };
    updateText(selectedStates, '.locations h4');
    updateText(selectedCities, '.locations h4');
    updateText(selectedAmenities, '.amenities h4');
  });

  $('button').click(function () {
    const filterData = {};
    if (Object.keys(selectedAmenities).length > 0) filterData.amenities = Object.keys(selectedAmenities);
    if (Object.keys(selectedStates).length > 0) filterData.states = Object.keys(selectedStates);
    if (Object.keys(selectedCities).length > 0) filterData.cities = Object.keys(selectedCities);
    fetchPlaces(filterData);
  });
});
