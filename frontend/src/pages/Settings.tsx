import ChangePassword from "../common/ChangePassword";
import TelegramConnection from "../pages/common/TelegramConnection";
import AddParticipant from "./common/AddParticipant";
const Settings = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h3>Settings</h3>
            {/* <h3>Change Password</h3> */}
            <div style={{ marginBottom: "30px" }}>
                <ChangePassword />
            </div>
            <div style={{ marginBottom: "30px" }}>
                <AddParticipant />
            </div>
            {/* <br /> */}
            {/* <h3>Telegram Connection</h3> */}
            <TelegramConnection />
        </div>
    );
};
export default Settings;