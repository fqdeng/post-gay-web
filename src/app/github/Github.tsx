import React, {useState, useEffect} from 'react';
import {GithubOutlined} from "@ant-design/icons";
import {Card} from "antd"


export interface GitHubStarsProps {
    repo: string,
}

const GitHubStars: React.FC<GitHubStarsProps> = (props) => {
    const [stars, setStars] = useState(null);

    async function fetchGitHubStars(repo: string) {
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            const data = await response.json();
            return data.stargazers_count;
        } catch (error) {
            console.error("Error fetching repository data:", error);
            return null;
        }
    }

    useEffect(() => {
        fetchGitHubStars(props.repo).then(setStars);
    }, [props.repo]);

    return (
        <Card
              bodyStyle={{paddingTop: 2, paddingBottom: 2, paddingLeft: 10, paddingRight: 10}}>
            <GithubOutlined/>  {stars !== null ? stars : 'Loading...'}
        </Card>
    );
};

export default GitHubStars;
