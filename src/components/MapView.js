import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { withRouter } from 'react-router-dom'

const leafletContainer = {
    // height cannot be set relative to ancester (using e.g. height = '100%'). It must be set fixed or relative to viewport
    height: '92vh',
    width: '100vw',
    margin: 'auto',
    position: 'fixed'
}

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

const presentAlert = async (id, companyName, history, ref, showActivityDetail) => {

    const alert = await ref.current.create({
        mode: 'ios',
        header: companyName,
        buttons: [{
            text: 'Info',
            role: 'details',
            handler: () => {
                history.push('/activity-detail/' + id);
                return showActivityDetail(id);
            }
        }, {
            text: 'Add Activity',
            handler: () => {
                history.push('/add-activity/');
            }
        }, {
            text: 'Add to Favorites',
            handler: () => {
                console.log('Favorite clicked');
            }
        }, {
            text: 'Close',
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }]
    });
    await alert.present();
}


const getGeoBounds = (markers) => {
    let allLat = markers.reduce((prev, curr) => {
        return [...prev, curr.position[0]];
    }, []);
    let allLong = markers.reduce((prev, curr) => {
        return [...prev, curr.position[1]];
    }, []);

    let maxLat = Math.max.apply(Math, allLat);
    let minLat = Math.min.apply(Math, allLat);

    let maxLong = Math.max.apply(Math, allLong);
    let minLong = Math.min.apply(Math, allLong);

    let newBounds = this.bounds;

    if (allLat.length > 0) {
        let corner1 = [maxLat, maxLong],
            corner2 = [minLat, minLong];
        newBounds = [corner1, corner2];
    }

    return newBounds;
};
const MapView = (props) => {

    const markers = props.activities.activities.map(activity => {
        return {
            key: activity.id,
            position: [
                activity.company.location ? activity.company.location.latitude : 55,
                activity.company.location ? activity.company.location.longitude : 9
            ],
            children: activity.company.name
        }
    })

    const activityAlertController = React.createRef();

    const PopupMarker = withRouter(({ id, children, position, history }) => (
        <Marker
            position={position}
            onClick={() => { presentAlert(id, children, history, activityAlertController) }}
        >
        </Marker>
    ))

    const MarkersList = ({ markers }) => {
        const items = markers.map(({ key, ...props }) => (
            <PopupMarker key={key} {...props} id={key} />
        ))
        return <div style={{ display: 'none' }}>{items}</div>
    }

    const bounds = getGeoBounds(markers);

    return (
        <Map
            viewport={DEFAULT_VIEWPORT}
            bounds={bounds}
            style={leafletContainer}>
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ion-alert-controller ref={activityAlertController}/>
            <MarkersList markers={markers} />
        </Map>

    )
 }

export default MapView;