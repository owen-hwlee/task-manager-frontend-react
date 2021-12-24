import axios from 'axios';

export default class BaseHttpService {
    BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';
    
}