import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarker({ position, onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      // Quando o mapa é clicado, chama a função para atualizar a posição no formulário
      onPositionChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom()); // Centraliza o mapa no local do clique
    },
  });

  // Mostra o marcador apenas se uma posição foi selecionada
  return position === null ? null : <Marker position={position}></Marker>;
}

const MapaSelect = ({
  position,
  onPositionChange,
  endereco,
  loadingEndereco,
}) => {
  // Coordenadas de Cuiabá para centralizar o mapa inicialmente
  const cuiabaCenter = [-15.601, -56.097];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Localização Avistada (clique no mapa)
      </label>
      <MapContainer
        center={cuiabaCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "250px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          onPositionChange={onPositionChange}
        />
      </MapContainer>
      {position && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
          <p>
            <strong>Lat:</strong> {position.lat.toFixed(4)},{" "}
            <strong>Lng:</strong> {position.lng.toFixed(4)}
          </p>
          {loadingEndereco && <p className="mt-1">Buscando endereço...</p>}
          {endereco && (
            <p className="mt-1">
              <strong>Endereço Aproximado:</strong> {endereco}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaSelect;
