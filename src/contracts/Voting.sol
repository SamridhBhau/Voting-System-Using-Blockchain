pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address public owner;
    string public electionName;

    mapping(address => Voter) private voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(string memory _name) {
        owner = msg.sender;
        electionName = _name;
    }
        
    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function authorizeVoter(address _voter) public onlyOwner {
        voters[_voter].authorized = true;
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender].voted, "You have already voted");
        require(voters[msg.sender].authorized, "You are not authorized to vote");

        voters[msg.sender].vote = _candidateId;
        voters[msg.sender].voted = true;

        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint _candidateId) public view returns (string memory, uint) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.name, candidate.voteCount);
    }

    function totalVotes() public view returns (uint) {
        uint total = 0;
        for (uint i = 1; i <= candidatesCount; i++) {
            total += candidates[i].voteCount;
        }
        return total;
    }

    function verifyVote(address _voter) public view returns (uint) {
        require(msg.sender == owner, "Only owner can verify votes");
        return voters[_voter].vote;
    }
}
