[gitex-flow](../README.md) / [avh](../modules/avh.md) / AvhBranchListParser

# Class: AvhBranchListParser

[avh](../modules/avh.md).AvhBranchListParser

Parser of the AVH branch list retrieved by 'git flow <branchName> list'.

## Table of contents

### Constructors

- [constructor](avh.avhbranchlistparser.md#constructor)

### Methods

- [parse](avh.avhbranchlistparser.md#parse)

## Constructors

### constructor

\+ **new AvhBranchListParser**(): [*AvhBranchListParser*](avh.avhbranchlistparser.md)

**Returns:** [*AvhBranchListParser*](avh.avhbranchlistparser.md)

## Methods

### parse

▸ `Static`**parse**(`list`: *string*): *Promise*<string[]\>

Parses the shell answer of AVH implementation.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`list` | *string* | List retrived by the shell command 'git flow <branchName> list'.    |

**Returns:** *Promise*<string[]\>

The branch list.
