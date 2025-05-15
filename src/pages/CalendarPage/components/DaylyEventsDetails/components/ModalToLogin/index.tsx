import { useNavigate } from "react-router"
import './styles.module.scss'
interface ModalToLoginProps {
	onClose: () => void;
}
const ModalToLogin = ({onClose}:ModalToLoginProps)=>{
		const navigate = useNavigate()
		const onConfirm = ()=>{
			navigate("/login")
		}
		return (
			<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<h2>Login Required</h2>
						<p>You need to login for continuation this action</p>
						<div className="modal-actions">
						<button className="btn btn-primary" onClick={onConfirm}>Login</button>
						<button className="btn btn-secondary" onClick={onClose}>Close</button>
						</div>
				</div>
			</div>
		)
}
export default ModalToLogin