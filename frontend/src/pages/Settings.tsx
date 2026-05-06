import ChangePassword from "../common/ChangePassword";
import TelegramConnection from "../pages/common/TelegramConnection";
import ParticipantView from "./common/ParticipantView";
const Settings = () => {
    return (
        <div>
            <h3>Settings</h3>
            {/* <h3>Change Password</h3> */}
            <ChangePassword />
            <ParticipantView />
            {/* <br /> */}
            {/* <h3>Telegram Connection</h3> */}
            <TelegramConnection />
        </div>
    );
};
export default Settings;