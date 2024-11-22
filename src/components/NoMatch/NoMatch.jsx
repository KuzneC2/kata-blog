import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NoMatch() {
  return (
    <>
      <Result
        status="warning"
        title="The page was not found."
        extra={
          <Link to='/'>
            <Button type="primary" key="console">
              Go Home
            </Button>
          </Link>
        }
      />
    </>
  );
}
