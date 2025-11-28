export const useNavigate = jest.fn();
export const useLocation = jest.fn(() => ({ pathname: '/' }));
export const useParams = jest.fn(() => ({}));

export * from 'react-router-dom';