import * as client from "./client";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
function Trainers() {
    const [account, setAccount] = useState<any>();
    const navigate = useNavigate();
    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            if (account.role !== "PROFESSOR") {
                navigate("/Pokenet/Account/Profile");
            }
            setAccount(account);
        } catch (error) {
            navigate("/Pokenet/Account/Login");
        }
    };
    const [trainers, setTrainers] = useState<any>([]);
    const fetchTrainers = async () => {
        try {
            const trainers = await client.findAllUsers();
            setTrainers(trainers.filter((trainer: any) => trainer.role === "TRAINER"));
        } catch (error) {
            console.log("Trainers not found")
        }
    };
    const updateTrainer = async (trainer: any, enrolled: Boolean) => {
        if (enrolled) {
            trainer.professorId = account.username;
        } else {
            trainer.professorId = "";
        }
        await client.updateUser(trainer);
        setTrainers(trainers.map((t: any) => (t._id === trainer._id ? trainer : t)));
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    useEffect(() => {
        if (account && account._id) {
            if (account.role === "PROFESSOR") {
                fetchTrainers();
            }
        }
    }, [account,]);
    return (
        <div>
            {account && account.role === "PROFESSOR" && (
                <div>
                    <h3>Trainers: </h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <td>
                                    <h4>Trainer Username: </h4>
                                </td>
                                <td>
                                    <h4>Trainer Name: </h4>
                                </td>
                                <td>
                                    <h4>Professor: </h4>
                                </td>
                                <td>
                                    <h4>Enrolled: </h4>
                                </td>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainers.map((trainer: any) => (
                                <tr key={trainer._id} >
                                    <td><Link to={`/Pokenet/Account/Profile/${trainer.username}`}> {trainer.username}</Link></td>
                                    <td>{trainer.firstName} {trainer.lastName}</td>
                                    <td><Link to={`/Pokenet/Account/Profile/${trainer.professorId}`}> {trainer.professorId}</Link></td>
                                    <td><input checked={trainer.professorId === account.username} className="ms-2" type="checkbox"
                                        disabled={trainer.professorId && trainer.professorId !== account.username} onChange={(e) =>
                                            updateTrainer(trainer, e.target.checked)}/></td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>

            )}
        </div >
    );
}
export default Trainers;