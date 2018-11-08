import { connect } from 'react-redux'
import Log from '../components/Log'

const mapStateToProps = ({ log: { events } }) => ({ events })

export default connect(mapStateToProps)(Log)
