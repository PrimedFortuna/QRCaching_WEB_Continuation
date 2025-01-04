document.addEventListener('DOMContentLoaded', function () {
    const eventId = localStorage.getItem('selectedEventId'); // Obter o ID do evento do localStorage

    if (!eventId) {
        // Caso nenhum evento tenha sido selecionado
        document.querySelector('.event-container').innerHTML = 'Nenhum evento selecionado.';
        return;
    }

    // Fazer fetch dos detalhes do evento pelo ID
    fetch(`http://maltinha.ddns.net/events/${eventId}`)
        .then(response => response.json())
        .then(event => {
            console.log('Dados do Evento:', event); // Log dos dados do evento
            // Verificar se o evento foi encontrado
            if (!event) {
                document.querySelector('.event-container').innerHTML = 'Evento não encontrado.';
                return;
            }

            // Preencher os detalhes do evento no HTML
            const eventBox = document.querySelector('.event-container');
            eventBox.innerHTML = `
                <!-- Imagem do Evento -->
                <img alt="Event Image" class="event-image" id="event-image" src="${event.image || 'default-image.jpg'}">

                <!-- Título do Evento -->
                <h1 class="event_name" id="event_name">${event.name || 'Nome do Evento'}</h1>

                <div class="event-details">
                    <!-- Latitude e Longitude do Evento -->
                    <div class="event-location">
                        <p class="event-latitude">Latitude: <span id="event-latitude">${event.latitude || '0.0000'}</span></p>
                        <p class="event-longitude">Longitude: <span id="event-longitude">${event.longitude || '0.0000'}</span></p>
                    </div>
                    <div class="event-dates">
                        <!-- Datas de Início e Fim do Evento -->
                        <p class="event-start-date">Data de Início: <span id="event-start-date">${event.startDate || 'YYYY-MM-DD'}</span></p>
                        <p class="event-end-date">Data de Término: <span id="event-end-date">${event.endDate || 'YYYY-MM-DD'}</span></p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do evento:', error);
            document.querySelector('.event-container').innerHTML = 'Erro ao carregar detalhes do evento.';
        });
});
